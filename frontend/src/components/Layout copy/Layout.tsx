import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Always open sidebar for USER role on route change
  const [sidebarOpen, setSidebarOpen] = useState(
    user?.role?.toUpperCase() === 'USER'
  );

  // useEffect(() => {
  //   setSidebarOpen(user?.role?.toUpperCase() === 'USER');
  // }, [user?.role, location.pathname]);

  useEffect(() => {
    setSidebarOpen(true);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isSidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        {/* Fixed Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Main content with left margin to avoid being under sidebar */}
        <main className="flex-1 ml-0 lg:ml-64 min-h-screen overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
