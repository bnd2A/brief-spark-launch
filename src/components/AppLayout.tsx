
import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">Briefly</span>
              </Link>
            </div>
            
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <LogOut size={18} className="mr-2" /> Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden md:block p-4">
          <nav className="space-y-1 mt-4">
            <Button 
              variant={isActive('/app/dashboard') ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => navigate('/app/dashboard')}
            >
              <LayoutDashboard size={18} className="mr-2" />
              Dashboard
            </Button>
            
            <Button 
              variant={isActive('/app/create') || isActive('/app/edit') ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => navigate('/app/create')}
            >
              <FileText size={18} className="mr-2" />
              Briefs
            </Button>
            
            <Button 
              variant={isActive('/app/settings') ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => navigate('/app/settings')}
            >
              <Settings size={18} className="mr-2" />
              Settings
            </Button>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-grow p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
