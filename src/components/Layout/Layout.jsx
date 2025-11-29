import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppStore } from '../../store/appStore';

const Layout = () => {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Updated with glass effect */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar - Updated with glass effect */}
        <Navbar />

        {/* Page Content - Updated background */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => useAppStore.getState().toggleSidebar()}
        />
      )}
    </div>
  );
};

export default Layout;