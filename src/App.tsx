
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import ThankYou from "./pages/ThankYou";
import LegalPage from "./pages/Legal";
import PayDone from "./pages/PayDone";
import GamePage from "./pages/GamePage";
import DevDocs from "./pages/DevDocs";
import DevGate from "./components/DevGate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/thanks" element={<ThankYou />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/pay/done" element={<PayDone />} />
          <Route path="/games/:slug" element={<GamePage />} />
          <Route
            path="/dev"
            element={
              <DevGate>
                <DevDocs />
              </DevGate>
            }
          />
          <Route
            path="/dev/:slug"
            element={
              <DevGate>
                <DevDocs />
              </DevGate>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;