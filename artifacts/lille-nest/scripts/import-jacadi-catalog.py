#!/usr/bin/env python3
"""Import Jacadi Saudi Arabia's public English product catalog and CMS pages.

This imports public product facts, descriptions, and page text. Product image
URLs may be recorded for linking, but image files are never downloaded. It reads
sitemap-listed pages and checks robots.txt before every request.
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
IMAGE_STATE_PATH = ROOT / ".cache/jacadi-image-import-state.json"
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
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack: list[dict[str, str]] = []
        self.meta: dict[str, str] = {}
        self.json_ld: list[str] = []
        self.script_buffer: list[str] | None = None
        self.name_parts: list[str] = []
        self.in_name = False
        self.sizes: list[str] = []
        self.colors: list[dict[str, str]] = []
        self.current_color: dict[str, str] | None = None
        self.regular_price_parts: list[str] = []
        self.description_parts: list[str] = []
        self.gallery_images: list[str] = []
        self.canonical = ""

    def _inside_class(self, fragment: str) -> bool:
        return any(fragment in item["class"] for item in self.stack)

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
        elif tag == "h1" and not self.name_parts:
            self.in_name = True

        if tag == "img" and "image" in values.get("itemprop", "").lower().split():
            image_url = (
                values.get("data-image-large-src")
                or values.get("data-full-size-image-url")
                or values.get("data-image-medium-src")
                or values.get("src")
            )
            if image_url:
                self.gallery_images.append(image_url)

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

    def handle_endtag(self, tag: str) -> None:
        if tag == "h1" and self.in_name:
            self.in_name = False
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
        if self.in_name:
            self.name_parts.append(data)
        if self._inside_class("regular-price"):
            self.regular_price_parts.append(data)
        if self._inside_class("product-description") and not any(
            "product-description-short" in item["id"] for item in self.stack
        ):
            self.description_parts.append(data)

    def product_schema(self) -> dict:
        for raw in self.json_ld:
            parsed = None
            for candidate in (raw, html.unescape(raw)):
                try:
                    parsed = json.loads(candidate)
                    break
                except (json.JSONDecodeError, TypeError):
                    continue
            if parsed is None:
                continue
            items = parsed if isinstance(parsed, list) else [parsed]
            for item in items:
                if isinstance(item, dict) and item.get("@type") == "Product":
                    return item
        return {}


def schema_image_candidates(schema: dict) -> list[str]:
    schema_images = schema.get("image", [])
    if isinstance(schema_images, str):
        return [schema_images]
    if isinstance(schema_images, dict):
        return [
            value
            for value in (schema_images.get("contentUrl"), schema_images.get("url"))
            if isinstance(value, str)
        ]
    if isinstance(schema_images, list):
        candidates: list[str] = []
        for schema_image in schema_images:
            if isinstance(schema_image, str):
                candidates.append(schema_image)
            elif isinstance(schema_image, dict):
                candidates.extend(
                    value
                    for value in (schema_image.get("contentUrl"), schema_image.get("url"))
                    if isinstance(value, str)
                )
        return candidates
    return []


def normalize_product_images(candidates: list[str]) -> list[str]:
    """Keep distinct public Jacadi product image links; never fetch image bytes."""
    images: list[str] = []
    seen_assets: set[str] = set()
    for candidate in candidates:
        if not candidate or not candidate.strip():
            continue
        image_url = urllib.parse.urljoin(f"{BASE}/", html.unescape(candidate.strip()))
        parsed = urllib.parse.urlparse(image_url)
        host = (parsed.hostname or "").lower()
        image_extension = Path(parsed.path).suffix.lower()
        if (
            parsed.scheme != "https"
            or not (host == "jacadi.sa" or host.endswith(".jacadi.sa"))
            or image_extension not in {".jpg", ".jpeg", ".png", ".webp", ".avif"}
        ):
            continue

        path = urllib.parse.unquote(parsed.path)
        asset_id = re.search(r"/(\d+)-[^/]+/", path)
        identity = f"asset:{asset_id.group(1)}" if asset_id else f"url:{image_url}"
        if identity in seen_assets:
            continue
        seen_assets.add(identity)
        images.append(image_url)
    return images


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
    parser = ProductPageParser()
    parser.feed(raw.decode("utf-8", "replace"))
    schema = parser.product_schema()

    offers = schema.get("offers", {})
    if isinstance(offers, list):
        offers = offers[0] if offers else {}
    if not isinstance(offers, dict):
        offers = {}
    product_name = (
        normalize_text(schema.get("name", ""))
        or normalize_text(" ".join(parser.name_parts))
        or normalize_text(parser.meta.get("og:title", "").split("|", 1)[0])
    )
    price_value = offers.get("price") or parser.meta.get("product:price:amount")
    try:
        price = float(price_value)
    except (TypeError, ValueError):
        price = 0
    if not product_name or price <= 0:
        return None

    original_price = None
    if schema:
        regular_text = normalize_text(" ".join(parser.regular_price_parts))
        amounts = re.findall(r"\d+(?:[.,]\d{1,2})?", regular_text.replace(",", ""))
        original_price = float(amounts[-1]) if amounts else None
        if not original_price or original_price <= price:
            original_price = None

    variants = []
    seen_variants = set()
    for color in parser.colors:
        key = (color["name"], color["url"])
        if key not in seen_variants:
            variants.append(color)
            seen_variants.add(key)

    description = (
        normalize_text(schema.get("description", ""))
        or normalize_text(" ".join(parser.description_parts))
        or normalize_text(parser.meta.get("description", ""))
    )
    source_url = parser.canonical if parser.canonical.startswith(BASE) else url
    category_name = category_slug.replace("-", " ").title()
    product_id = str(schema.get("sku") or filename.split("-", 1)[0])
    images = normalize_product_images(
        [
            parser.meta.get("og:image", ""),
            *schema_image_candidates(schema),
            *parser.gallery_images,
        ]
    )

    return {
        "id": product_id,
        "title": product_name,
        "slug": slug,
        "description": description,
        "price": price,
        "originalPrice": original_price,
        "currency": offers.get("priceCurrency") or parser.meta.get("product:price:currency") or "SAR",
        "images": images,
        "categories": [category_slug],
        "categoryName": category_name,
        "sizes": list(dict.fromkeys(parser.sizes)),
        "colors": variants,
        "availability": offers.get("availability", "").rsplit("/", 1)[-1],
        "sourceUrl": source_url,
        "reference": schema.get("sku", "") or product_id,
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
        "images": [],
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


def save_catalog(path: Path, catalog: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(catalog, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    temporary.replace(path)


def save_image_state(state: dict) -> None:
    IMAGE_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary = IMAGE_STATE_PATH.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, ensure_ascii=False), encoding="utf-8")
    temporary.replace(IMAGE_STATE_PATH)


def import_images_only(args: argparse.Namespace, robots: urllib.robotparser.RobotFileParser) -> None:
    if not args.output.exists():
        raise SystemExit(f"Catalog file not found: {args.output}")
    try:
        catalog = json.loads(args.output.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f"Could not read catalog at {args.output}: {error}") from error

    state = {"images": {}}
    if args.resume and IMAGE_STATE_PATH.exists():
        try:
            state = json.loads(IMAGE_STATE_PATH.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass
    state.setdefault("images", {})
    state.setdefault("failures", {})
    products = catalog.get("products", [])
    targets = products[: args.limit] if args.limit else products
    previous_request = [0.0]
    updated = 0

    for index, product in enumerate(targets, 1):
        source_url = product.get("sourceUrl", "")
        if not source_url:
            continue
        if args.resume and product.get("images"):
            cached_images = normalize_product_images(product["images"])
            if cached_images:
                product["images"] = cached_images
                state["images"][source_url] = cached_images
                continue
        if args.resume and source_url in state["images"]:
            stored_images = state["images"][source_url]
            cached_images = normalize_product_images(stored_images)
            if not stored_images or cached_images:
                product["images"] = cached_images
                continue

        try:
            raw = fetch_bytes(source_url, robots, args.delay, previous_request)
        except PermissionError as error:
            state["failures"][source_url] = str(error)
            save_image_state(state)
            updated += 1
            continue
        except urllib.error.HTTPError as error:
            if error.code == 429 or error.code < 400 or error.code >= 500:
                raise
            state["failures"][source_url] = f"HTTP {error.code}"
            save_image_state(state)
            updated += 1
            continue

        parser = ProductPageParser()
        parser.feed(raw.decode("utf-8", "replace"))
        schema = parser.product_schema()
        candidates = [
            parser.meta.get("og:image", ""),
            *schema_image_candidates(schema),
            *parser.gallery_images,
        ]
        product["images"] = normalize_product_images(candidates)
        state["images"][source_url] = product["images"]
        state["failures"].pop(source_url, None)
        save_image_state(state)
        updated += 1

        if index % 20 == 0 or index == len(targets):
            catalog["fetchedAt"] = datetime.now(timezone.utc).isoformat()
            save_catalog(args.output, catalog)
            print(
                f"Image URLs {index}/{len(targets)}; updated {updated}; "
                f"with images {sum(bool(item.get('images')) for item in targets)}; "
                f"fetch errors {len(state['failures'])}",
                flush=True,
            )

    catalog["fetchedAt"] = datetime.now(timezone.utc).isoformat()
    save_catalog(args.output, catalog)
    print(
        f"Saved image URL references for {len(products)} products to {args.output}; "
        f"no image files were downloaded; fetch errors: {len(state['failures'])}."
    )


def main() -> None:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--limit", type=int, help="Import only the first N unique products (for a small test run).")
    cli.add_argument("--delay", type=float, default=0.8, help="Minimum seconds between source-site requests.")
    cli.add_argument("--resume", action="store_true", help="Reuse successful pages from the previous interrupted run.")
    cli.add_argument(
        "--images-only",
        action="store_true",
        help="Populate product image URL references in the existing catalog without re-importing product data.",
    )
    cli.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Destination JSON path.")
    args = cli.parse_args()
    if args.delay < 0.5:
        raise SystemExit("Use a delay of at least 0.5 seconds between requests.")

    robots = urllib.robotparser.RobotFileParser()
    robots.set_url(f"{BASE}/robots.txt")
    robots.read()
    if args.images_only:
        import_images_only(args, robots)
        return

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

    save_state(state)

    products = sorted(
        state["products"].values(),
        key=lambda item: (item["categories"][0], item["title"].casefold()),
    )
    categories_by_slug: dict[str, dict] = {
        slug: {
            "id": slug,
            "slug": slug,
            "name": slug.replace("-", " ").title(),
            "productCount": 0,
            "sourceUrl": url,
        }
        for slug, url in category_urls.items()
    }
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