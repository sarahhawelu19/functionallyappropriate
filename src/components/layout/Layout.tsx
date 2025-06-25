import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside
  const handleContentClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* Overlay when sidebar is open - lower z-index than sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-25"
            onClick={handleContentClick}
            aria-hidden="true"
          />
        )}
        
        <main 
          className="flex-1 p-4 md:p-6 pb-20 xl:pb-6 page-transition transition-all duration-300"
          onClick={handleContentClick}
        >
          <Outlet />
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Layout;