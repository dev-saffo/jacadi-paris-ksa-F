import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import CatalogPage from "./pages/CatalogPage";
import CatalogPages from "./pages/CatalogPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
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
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
