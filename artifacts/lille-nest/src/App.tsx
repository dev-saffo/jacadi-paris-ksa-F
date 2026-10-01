import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";

const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Search = lazy(() => import("./pages/Search"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const CatalogPages = lazy(() => import("./pages/CatalogPages"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function RouteLoading() {
  return (
    <main
      className="grid min-h-[60vh] place-items-center bg-background px-5 text-sm text-muted-foreground"
      role="status"
    >
      Loading page…
    </main>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/pages" element={<CatalogPages />} />
                <Route path="/pages/:slug" element={<CatalogPage />} />
                <Route path="/about" element={<Navigate to="/pages/our-story" replace />} />
                <Route path="/contact" element={<Navigate to="/pages/contact-us" replace />} />
                <Route path="/contact-us" element={<Navigate to="/pages/contact-us" replace />} />
                <Route path="/customer-service" element={<Navigate to="/pages/customer-service" replace />} />
                <Route path="/faq" element={<Navigate to="/pages/faq" replace />} />
                <Route path="/shipping" element={<Navigate to="/pages/shipping" replace />} />
                <Route path="/returns" element={<Navigate to="/pages/returns" replace />} />
                <Route path="/sustainability" element={<Navigate to="/pages/sustainable-elegance" replace />} />
                <Route path="/privacy" element={<Navigate to="/pages/privacy-policy" replace />} />
                <Route path="/terms" element={<Navigate to="/pages/terms-and-conditions" replace />} />
                <Route path="/cookies" element={<Navigate to="/pages/cookies-policy" replace />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
