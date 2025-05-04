
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-6 bg-secondary/50">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="mb-6">
              Powerful features to <span className="gradient-text">streamline your workflow</span>
            </h1>
            <p className="text-xl mb-10 text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create, share, and manage professional client briefs in one place.
            </p>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center mb-16">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                title="Create Custom Briefs" 
                description="Build elegant forms with our drag-and-drop editor. Add custom questions, multiple choice fields, and more."
                icon="pencil"
              />
              <FeatureCard 
                title="Share Easily" 
                description="Generate a clean, branded URL to share with clients - no login required for them to complete."
                icon="share"
              />
              <FeatureCard 
                title="Get Organized" 
                description="Receive email notifications when a brief is submitted. View all responses in one place."
                icon="folder"
              />
              <FeatureCard 
                title="Export Anywhere" 
                description="Download completed briefs as professional PDFs or markdown files for your documentation."
                icon="download"
              />
              <FeatureCard 
                title="Look Professional" 
                description="Impress clients with a seamless experience that represents your brand perfectly."
                icon="book"
              />
              <FeatureCard 
                title="Save Time" 
                description="Collect all the information you need upfront, avoiding back-and-forth emails and calls."
                icon="save"
              />
            </div>
          </div>
        </section>

        {/* Form Builder Section */}
        <section className="py-20 px-6 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="mb-6">Intuitive form builder</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Easily create beautiful, interactive forms with our drag-and-drop builder. No technical skills required.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Multiple question types: text, multiple choice, checkboxes, file upload",
                    "Conditional logic to show/hide questions based on previous answers",
                    "Add your own branding, colors, and imagery",
                    "Mobile-friendly forms that work on any device"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => navigate("/app/dashboard")}>
                  Try the form builder
                </Button>
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <AspectRatio ratio={16 / 10} className="bg-secondary/30 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">[Form Builder Screenshot]</p>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </section>

        {/* Client Experience Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 bg-white p-4 rounded-xl border shadow-sm">
                <AspectRatio ratio={16 / 10} className="bg-secondary/30 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">[Client View Screenshot]</p>
                  </div>
                </AspectRatio>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="mb-6">Seamless client experience</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Make a great impression with branded, easy-to-complete briefs that clients love filling out.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "No login required for clients to complete briefs",
                    "Progress saving for long forms",
                    "Mobile-optimized for completion on any device",
                    "Professional, branded experience throughout"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="py-20 px-6 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="mb-6">Insightful analytics</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Track performance and gain insights into how clients interact with your briefs.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "See completion rates for your briefs",
                    "Identify dropped-off points to improve your forms",
                    "Get notified when clients submit responses",
                    "Export data for further analysis"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => navigate("/app/dashboard")}>
                  View dashboard
                </Button>
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <AspectRatio ratio={16 / 10} className="bg-secondary/30 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">[Analytics Dashboard Screenshot]</p>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-accent text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Ready to get started?</h2>
            <p className="text-xl mb-10 text-accent-foreground/90 max-w-2xl mx-auto">
              Join hundreds of freelancers and agencies who are streamlining their client onboarding with Briefly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/app/dashboard")}
                className="h-12 px-6"
              >
                Create your first brief
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-6 border-white text-white hover:bg-white/10"
                onClick={() => navigate("/pricing")}
              >
                View pricing plans
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FeaturesPage;
