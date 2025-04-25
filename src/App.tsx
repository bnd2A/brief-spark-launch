
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";

// Pages
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import CreateBrief from "@/pages/CreateBrief";
import EditBrief from "@/pages/EditBrief";
import BriefView from "@/pages/BriefView";
import NotFound from "@/pages/NotFound";
import Responses from "@/pages/Responses";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/create" element={<CreateBrief />} />
            <Route path="/app/edit/:id" element={<EditBrief />} />
            <Route path="/share/:id" element={<BriefView />} />
            <Route path="/app/responses/:id" element={<Responses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
