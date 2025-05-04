
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent -z-10"></div>
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="animate-fade-in">
              <h1 className="mb-6">
                The easiest way to <span className="gradient-text">collect client briefs</span>
              </h1>
              <p className="text-xl mb-10 text-muted-foreground max-w-3xl mx-auto">
                Briefly helps freelancers and agencies collect structured project information with beautiful, 
                interactive forms that impress clients from day one.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/app/dashboard")}
                  className="h-12 px-6 gap-2"
                >
                  Start for free <ArrowRight size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-12 px-6"
                  onClick={() => {
                    const demoSection = document.getElementById('how-it-works');
                    demoSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See how it works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview Section */}
        <section className="py-20 px-6 bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center mb-16">Everything you need to impress clients</h2>
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
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" onClick={() => navigate('/features')} className="gap-2">
                Explore all features <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-16">How Briefly works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 text-2xl font-semibold">1</div>
                <h3 className="text-xl mb-3">Create your brief</h3>
                <p className="text-muted-foreground">Build a custom brief with our intuitive drag-and-drop editor. Add questions, options, and file uploads.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 text-2xl font-semibold">2</div>
                <h3 className="text-xl mb-3">Share with clients</h3>
                <p className="text-muted-foreground">Send your branded brief link to clients. They can fill it out on any device without creating an account.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 text-2xl font-semibold">3</div>
                <h3 className="text-xl mb-3">Get structured responses</h3>
                <p className="text-muted-foreground">Receive completed briefs in your dashboard. Export as PDF or markdown for your workflow.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 px-6 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-12">Trusted by freelancers and agencies</h2>
            <div className="bg-background p-6 md:p-10 rounded-xl border shadow-sm">
              <p className="text-xl italic mb-6">"Briefly has completely transformed how I onboard new clients. The forms are beautiful, and I get all the information I need upfront without endless email threads."</p>
              <div>
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-muted-foreground">Web Designer & Developer</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-accent text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Start collecting better briefs today</h2>
            <p className="text-xl mb-10 text-accent-foreground/90 max-w-2xl mx-auto">
              Join hundreds of freelancers and agencies who are impressing clients and saving time with Briefly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/app/dashboard")}
                className="h-12 px-6"
              >
                Get started for free
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

export default LandingPage;
