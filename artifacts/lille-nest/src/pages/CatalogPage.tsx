import { useParams } from "react-router-dom";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { sourcePages } from "@/data/products";
import NotFound from "@/pages/NotFound";

const CatalogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = sourcePages.find((sourcePage) => sourcePage.slug === slug);

  if (!page) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <header className="border-b border-border bg-muted/30 py-12 md:py-16">
          <div className="container max-w-4xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Catalog page
            </p>
            <h1 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              {page.title}
            </h1>
            {page.description && (
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {page.description}
              </p>
            )}
          </div>
        </header>

        <article className="container max-w-4xl py-10 md:py-16">
          <div className="space-y-5">
            {page.blocks.map((block, index) => {
              const key = `${block.type}-${index}`;
              const type = block.type.toLowerCase();

              if (type === "h1") {
                return (
                  <h2
                    key={key}
                    className="pt-4 font-display text-2xl font-semibold text-foreground md:text-3xl"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (type === "h2") {
                return (
                  <h2
                    key={key}
                    className="pt-4 font-display text-xl font-semibold text-foreground md:text-2xl"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (type === "h3") {
                return (
                  <h3
                    key={key}
                    className="pt-3 font-display text-lg font-semibold text-foreground"
                  >
                    {block.text}
                  </h3>
                );
              }
              if (type === "li") {
                return (
                  <p
                    key={key}
                    className="relative pl-6 leading-relaxed text-muted-foreground before:absolute before:left-1 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary"
                  >
                    {block.text}
                  </p>
                );
              }

              return (
                <p key={key} className="leading-relaxed text-muted-foreground">
                  {block.text}
                </p>
              );
            })}
          </div>
        </article>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default CatalogPage;