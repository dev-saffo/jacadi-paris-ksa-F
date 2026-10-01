import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="max-w-lg text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[.2em] text-accent-foreground">A little detour</p>
          <h1 className="mb-4 text-7xl text-primary sm:text-8xl">404</h1>
          <p className="mb-7 text-lg text-muted-foreground">This page has wandered off the map.</p>
          <Link to="/" className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 text-xs font-semibold uppercase tracking-[.13em] text-primary-foreground transition-colors hover:bg-primary/90">
            Return to Jacadi
          </Link>
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default NotFound;
