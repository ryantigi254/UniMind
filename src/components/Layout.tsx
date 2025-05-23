import React, { useEffect } from 'react';
import { useStore } from '../store';
import MainHeader from './MainHeader';
import Sidebar from './Sidebar';
import CrisisButton from './CrisisButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarOpen, isSidebarCollapsed, toggleSidebar } = useStore();

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar-container');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node) &&
        window.innerWidth < 768 &&
        isSidebarOpen
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <MainHeader />
      <CrisisButton />
      
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-20"
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main 
          className={`
            flex-1 relative w-full
            transition-[padding] duration-300 ease-in-out
            bg-background-light dark:bg-background-dark
            ${isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}
          `}
        >
          {children}
        </main>

        {/* Sidebar */}
        <aside
          id="sidebar-container"
          className={`
            fixed md:fixed inset-y-0 left-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${isSidebarCollapsed ? 'w-16' : 'w-64'}
            transition-all duration-300 ease-in-out
            z-30
            h-[calc(100vh-4rem)]
            bg-sidebar-light dark:bg-sidebar-dark border-r border-gray-200 dark:border-gray-800
          `}
        >
          <Sidebar />
        </aside>
      </div>
    </div>
  );
};

export default Layout;