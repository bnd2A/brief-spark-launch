
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Get current page for active state
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">Briefly</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium ${isActive('/') ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`text-sm font-medium ${isActive('/features') ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium ${isActive('/pricing') ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
            >
              Pricing
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                  <Link to="/app/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                  Sign out
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="hidden md:flex">
                  <Link to="/auth">Get started</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md ${isActive('/') ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`px-3 py-2 rounded-md ${isActive('/features') ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`px-3 py-2 rounded-md ${isActive('/pricing') ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link 
                  to="/app/dashboard" 
                  className="px-3 py-2 rounded-md bg-primary text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start px-3"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="px-3 py-2 rounded-md text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  to="/auth" 
                  className="px-3 py-2 rounded-md bg-primary text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
