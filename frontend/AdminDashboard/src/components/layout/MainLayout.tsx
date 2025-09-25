import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

import { useSessionTimeout } from '../../hooks/useSessionTimeout';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const { user, logout } = useAuth();

  // Session timeout handling
  useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    onWarning: () => {
      // Could show a warning modal here
      console.log('Session will expire in 5 minutes');
    },
    onTimeout: () => {
      console.log('Session expired');
    },
  });

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs: Array<{ label: string; href?: string }> = [{ label: 'Dashboard', href: '/' }];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (index === segments.length - 1) {
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });
    
    return breadcrumbs.length > 1 ? breadcrumbs : [];
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          'fixed inset-y-0 left-0 z-50 lg:static lg:inset-0',
          'transform transition-transform duration-300 ease-in-out lg:transform-none',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={handleSidebarToggle}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onMenuToggle={handleMobileMenuToggle}
            breadcrumbs={generateBreadcrumbs()}
            user={user ? {
              name: user.full_name,
              email: user.email,
              role: user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              avatar: undefined
            } : undefined}
            onLogout={handleLogout}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    );
};

export { MainLayout };