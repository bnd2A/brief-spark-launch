
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Re-exporting the LandingPage component for the index route
import LandingPage from "./LandingPage";

const Index = () => {
  return <LandingPage />;
};

export default Index;
