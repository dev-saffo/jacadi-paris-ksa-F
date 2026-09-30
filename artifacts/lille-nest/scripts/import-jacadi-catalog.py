#!/usr/bin/env python3
"""Import Jacadi Saudi Arabia's public English catalog and CMS pages.

Product and editorial images are stored as source URLs; this script never
downloads image files. It reads only public sitemap-listed pages and checks
robots.txt before every request.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.robotparser
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path


BASE = "https://www.jacadi.sa"
SITEMAP_INDEX = f"{BASE}/1_index_sitemap.xml"
USER_AGENT = "JacadiPublicCatalogImporter/1.0"
ROOT = Path(__file__).resolve().parents[3]
DEFAULT_OUTPUT = ROOT / "artifacts/lille-nest/src/data/jacadi-catalog.json"
STATE_PATH = ROOT / ".cache/jacadi-catalog-import-state.json"
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
PRODUCT_PATH = re.compile(r"^/en/([^/?]+)/([^/]+)\.html$")


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def get_xml_urls(document: bytes) -> list[str]:
    root = ET.fromstring(document)
    return [
        (node.text or "").strip()
        for node in root.findall(".//s:loc", NS)
        if (node.text or "").strip()
    ]


def fetch_bytes(
    url: str,
    robots: urllib.robotparser.RobotFileParser,
    delay: float,
    previous_request: list[float],
) -> bytes:
    if not robots.can_fetch(USER_AGENT, url):
        raise PermissionError(f"robots.txt disallows this path: {url}")

    wait = delay - (time.monotonic() - previous_request[0])
    if wait > 0:
        time.sleep(wait)

    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xml;q=0.9,*/*;q=0.5",
        },
    )
    for attempt in range(4):
        previous_request[0] = time.monotonic()
        try:
            with urllib.request.urlopen(request, timeout=35) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code == 429:
                retry_after = error.headers.get("Retry-After", "")
                try:
                    pause = max(delay, float(retry_after))
                except ValueError:
                    pause = max(delay, 10.0)
                time.sleep(pause)
                continue
            if error.code >= 500 and attempt < 3:
                time.sleep(max(delay, 2**attempt))
                continue
            raise
        except (TimeoutError, urllib.error.URLError):
            if attempt == 3:
                raise
            time.sleep(max(delay, 2**attempt))
    raise RuntimeError(f"Could not fetch {url}")


class ProductPageParser(HTMLParser):
    def __init__(self, expected_slug: str):
        super().__init__(convert_charrefs=True)
        self.expected_slug = expected_slug.lower()
        self.stack: list[dict[str, str]] = []
        self.meta: dict[str, str] = {}
        self.json_ld: list[str] = []
        self.script_buffer: list[str] | None = None
        self.images: list[str] = []
        self.sizes: list[str] = []
        self.colors: list[dict[str, str]] = []
        self.current_color: dict[str, str] | None = None
        self.regular_price_parts: list[str] = []
        self.description_parts: list[str] = []
        self.canonical = ""

    def _inside_class(self, fragment: str) -> bool:
        return any(fragment in item["class"] for item in self.stack)

    def _add_image(self, value: str) -> None:
        value = html.unescape(value.strip())
        if not value.startswith("https://www.jacadi.sa/"):
            return
        filename = urllib.parse.urlparse(value).path.rsplit("/", 1)[-1].lower()
        if self.expected_slug not in filename:
            return
        if not re.search(r"\.(?:jpg|jpeg|png|webp)$", filename):
            return
        if "thumbnail_default" in value or "medium_default" in value:
            return
        if value not in self.images:
            self.images.append(value)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        classes = values.get("class", "")
        self.stack.append({"tag": tag, "class": classes, "id": values.get("id", "")})

        if tag == "meta":
            key = values.get("property") or values.get("name")
            if key:
                self.meta[key.lower()] = values.get("content", "")
        elif tag == "link" and values.get("rel", "").lower() == "canonical":
            self.canonical = values.get("href", "")
        elif tag == "script" and values.get("type", "").lower() == "application/ld+json":
            self.script_buffer = []

        in_variants = self._inside_class("product-variants")
        if in_variants and tag == "input":
            size = normalize_text(values.get("title", ""))
            if size and size not in self.sizes:
                self.sizes.append(size)

        if tag == "li" and "list-imgs" in classes:
            self.current_color = {
                "name": normalize_text(values.get("title", "")),
                "url": "",
            }
        elif tag == "a" and self.current_color and values.get("href", "").startswith(BASE):
            self.current_color["url"] = values["href"]

        if tag == "img":
            for attr in ("src", "data-src", "data-image-large-src", "data-zoom-image"):
                self._add_image(values.get(attr, ""))
        elif tag == "a":
            self._add_image(values.get("href", ""))

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self.script_buffer is not None:
            self.json_ld.append("".join(self.script_buffer))
            self.script_buffer = None
        if tag == "li" and self.current_color:
            if self.current_color["name"]:
                self.colors.append(self.current_color)
            self.current_color = None

        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]["tag"] == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data: str) -> None:
        if self.script_buffer is not None:
            self.script_buffer.append(data)
        if self._inside_class("regular-price"):
            self.regular_price_parts.append(data)
        if self._inside_class("product-description") and not any(
            "product-description-short" in item["id"] for item in self.stack
        ):
            self.description_parts.append(data)

    def product_schema(self) -> dict:
        for raw in self.json_ld:
            try:
                parsed = json.loads(html.unescape(raw))
            except (json.JSONDecodeError, TypeError):
                continue
            items = parsed if isinstance(parsed, list) else [parsed]
            for item in items:
                if isinstance(item, dict) and item.get("@type") == "Product":
                    return item
        return {}


class ContentPageParser(HTMLParser):
    SKIP_TAGS = {"script", "style", "noscript", "svg", "header", "footer", "nav", "form"}
    TEXT_TAGS = {"h1", "h2", "h3", "p", "li"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.skipped = 0
        self.meta: dict[str, str] = {}
        self.title_parts: list[str] = []
        self.blocks: list[dict[str, str]] = []
        self.current_tag = ""
        self.current_parts: list[str] = []
        self.images: list[str] = []
        self.in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        self.stack.append(tag)
        if tag in self.SKIP_TAGS:
            self.skipped += 1
        if tag == "meta":
            key = values.get("property") or values.get("name")
            if key:
                self.meta[key.lower()] = values.get("content", "")
        if tag == "title":
            self.in_title = True
        if not self.skipped and tag in self.TEXT_TAGS and not self.current_tag:
            self.current_tag = tag
            self.current_parts = []
        if tag == "img":
            src = values.get("src") or values.get("data-src")
            if src.startswith(BASE) and "/img/cms/" in src and src not in self.images:
                self.images.append(src)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False
        if tag == self.current_tag:
            text = normalize_text(" ".join(self.current_parts))
            if text:
                self.blocks.append({"type": self.current_tag, "text": text})
            self.current_tag = ""
            self.current_parts = []
        if tag in self.SKIP_TAGS and self.skipped:
            self.skipped -= 1
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index] == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self.current_tag and not self.skipped:
            self.current_parts.append(data)


def parse_product(url: str, raw: bytes) -> dict | None:
    path = urllib.parse.urlparse(url).path
    match = PRODUCT_PATH.match(path)
    if not match:
        return None
    category_slug, final_segment = match.groups()
    filename = final_segment.removesuffix(".html")
    slug = re.sub(r"^(?:\d+-)+", "", filename)
    parser = ProductPageParser(slug)
    parser.feed(raw.decode("utf-8", "replace"))
    schema = parser.product_schema()
    if not schema:
        return None

    offers = schema.get("offers", {})
    if isinstance(offers, list):
        offers = offers[0] if offers else {}
    try:
        price = float(offers.get("price"))
    except (TypeError, ValueError):
        price = 0
    if not schema.get("name") or price <= 0:
        return None

    regular_text = normalize_text(" ".join(parser.regular_price_parts))
    amounts = re.findall(r"\d+(?:[.,]\d{1,2})?", regular_text.replace(",", ""))
    original_price = float(amounts[-1]) if amounts else None
    if not original_price or original_price <= price:
        original_price = None

    schema_images = schema.get("image", [])
    if isinstance(schema_images, str):
        schema_images = [schema_images]
    images = list(dict.fromkeys([*schema_images, parser.meta.get("og:image", ""), *parser.images]))
    images = [
        image for image in images
        if image.startswith("https://www.jacadi.sa/")
        and re.search(r"\.(?:jpg|jpeg|png|webp)(?:\?|$)", image, re.I)
    ]

    variants = []
    seen_variants = set()
    for color in parser.colors:
        key = (color["name"], color["url"])
        if key not in seen_variants:
            variants.append(color)
            seen_variants.add(key)

    description = normalize_text(schema.get("description", "")) or normalize_text(
        " ".join(parser.description_parts)
    )
    source_url = parser.canonical if parser.canonical.startswith(BASE) else url
    category_name = category_slug.replace("-", " ").title()
    product_id = str(schema.get("sku") or filename.split("-", 1)[0])

    return {
        "id": product_id,
        "title": normalize_text(schema["name"]),
        "slug": slug,
        "description": description,
        "price": price,
        "originalPrice": original_price,
        "currency": offers.get("priceCurrency") or "SAR",
        "images": images,
        "categories": [category_slug],
        "categoryName": category_name,
        "sizes": list(dict.fromkeys(parser.sizes)),
        "colors": variants,
        "availability": offers.get("availability", "").rsplit("/", 1)[-1],
        "sourceUrl": source_url,
        "reference": schema.get("sku", ""),
    }


def page_key(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    if path == "/en/":
        return "home"
    return path.removeprefix("/en/").strip("/")


def parse_content_page(url: str, raw: bytes) -> dict:
    parser = ContentPageParser()
    parser.feed(raw.decode("utf-8", "replace"))
    path = urllib.parse.urlparse(url).path
    slug = page_key(url)
    if slug.startswith("content/"):
        slug = slug.split("/", 1)[-1]
        slug = re.sub(r"^\d+-", "", slug)
    blocks = parser.blocks[:500]
    title_block = next((block["text"] for block in blocks if block["type"] == "h1"), "")
    return {
        "slug": slug,
        "title": title_block or normalize_text(parser.meta.get("og:title", "")) or normalize_text(" ".join(parser.title_parts)),
        "description": normalize_text(parser.meta.get("description", "")),
        "sourceUrl": url,
        "blocks": blocks,
        "images": parser.images[:30],
    }


def discover_pages(
    robots: urllib.robotparser.RobotFileParser,
    delay: float,
) -> tuple[list[str], list[str], dict[str, str]]:
    clock = [0.0]
    index = ET.fromstring(fetch_bytes(SITEMAP_INDEX, robots, delay, clock))
    sitemap_urls = [
        (node.text or "").strip()
        for node in index.findall(".//s:loc", NS)
        if (node.text or "").strip() and "_en_" in (node.text or "")
    ]
    all_urls: list[str] = []
    for sitemap_url in sitemap_urls:
        all_urls.extend(get_xml_urls(fetch_bytes(sitemap_url, robots, delay, clock)))

    product_by_key: dict[str, str] = {}
    content_pages: list[str] = []
    category_urls: dict[str, str] = {}
    for url in all_urls:
        parsed = urllib.parse.urlparse(url)
        if parsed.netloc != "www.jacadi.sa" or parsed.query:
            continue
        path = parsed.path
        match = PRODUCT_PATH.match(path)
        if match and match.group(1) != "content":
            category, final_segment = match.groups()
            slug = re.sub(r"^(?:\d+-)+", "", final_segment.removesuffix(".html"))
            product_by_key.setdefault(f"{category}/{slug}", url)
        elif path == "/en/" or path in {"/en/contact-us", "/en/jacadi-stores"} or path.startswith("/en/content/"):
            if url not in content_pages:
                content_pages.append(url)
        elif path.startswith("/en/"):
            segments = path.removeprefix("/en/").strip("/").split("/")
            if len(segments) == 1:
                match = re.match(r"^\d+-(.+)$", segments[0])
                if match:
                    category_urls.setdefault(match.group(1), url)
    return sorted(product_by_key.values()), sorted(content_pages), category_urls


def load_state(resume: bool) -> dict:
    if resume and STATE_PATH.exists():
        try:
            return json.loads(STATE_PATH.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass
    return {"products": {}, "pages": {}}


def save_state(state: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary = STATE_PATH.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, ensure_ascii=False), encoding="utf-8")
    temporary.replace(STATE_PATH)


def main() -> None:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--limit", type=int, help="Import only the first N unique products (for a small test run).")
    cli.add_argument("--delay", type=float, default=0.8, help="Minimum seconds between source-site requests.")
    cli.add_argument("--resume", action="store_true", help="Reuse successful pages from the previous interrupted run.")
    cli.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Destination JSON path.")
    args = cli.parse_args()
    if args.delay < 0.5:
        raise SystemExit("Use a delay of at least 0.5 seconds between requests.")

    robots = urllib.robotparser.RobotFileParser()
    robots.set_url(f"{BASE}/robots.txt")
    robots.read()

    product_urls, page_urls, category_urls = discover_pages(robots, args.delay)
    if args.limit:
        product_urls = product_urls[:args.limit]
    state = load_state(args.resume)
    previous_request = [0.0]

    for index, url in enumerate(product_urls, 1):
        if args.resume and url in state["products"]:
            continue
        raw = fetch_bytes(url, robots, args.delay, previous_request)
        item = parse_product(url, raw)
        if item:
            state["products"][url] = item
        if index % 20 == 0 or index == len(product_urls):
            save_state(state)
            print(f"Products {index}/{len(product_urls)}; parsed {len(state['products'])}", flush=True)

    for url in page_urls:
        if args.resume and url in state["pages"]:
            continue
        raw = fetch_bytes(url, robots, args.delay, previous_request)
        state["pages"][url] = parse_content_page(url, raw)
        save_state(state)

    products = sorted(
        state["products"].values(),
        key=lambda item: (item["categories"][0], item["title"].casefold()),
    )
    categories_by_slug: dict[str, dict] = {}
    for item in products:
        slug = item["categories"][0]
        if slug not in categories_by_slug:
            categories_by_slug[slug] = {
                "id": slug,
                "slug": slug,
                "name": item["categoryName"],
                "productCount": 0,
                "sourceUrl": category_urls.get(slug, f"{BASE}/en/"),
            }
        categories_by_slug[slug]["productCount"] += 1
    categories = sorted(categories_by_slug.values(), key=lambda item: item["name"].casefold())

    home = next((page for page in state["pages"].values() if page["slug"] == "home"), {})
    payload = {
        "source": BASE,
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "home": home,
        "categories": categories,
        "products": products,
        "pages": sorted(state["pages"].values(), key=lambda page: page["title"].casefold()),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(args.output.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    temporary.replace(args.output)
    print(
        f"Saved {len(products)} products, {len(categories)} categories, "
        f"and {len(payload['pages'])} public pages to {args.output}"
    )


if __name__ == "__main__":
    main()