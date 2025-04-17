import React from 'react';
import { Menu, User, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import UniMindTextLogo from './UniMindTextLogo';
import { useNavigate } from 'react-router-dom';

const MainHeader: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebarCollapse, toggleSidebar } = useStore();
  const navigate = useNavigate();

  const handleToggle = () => {
    if (window.innerWidth >= 768) {
      toggleSidebarCollapse();
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-gray-900 fixed top-0 left-0 right-0 z-30 border-b border-gray-800">
      <div className="flex items-center gap-4">
        <button
          id="sidebar-toggle"
          onClick={handleToggle}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isSidebarCollapsed}
        >
          <Menu className="h-5 w-5" />
        </button>
        {isSidebarCollapsed && <UniMindTextLogo />}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Crisis Support"
          title="Crisis Support"
          onClick={() => document.getElementById('crisis-modal-trigger')?.click()}
        >
          <AlertTriangle className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => navigate('/settings')}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Account Settings"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default MainHeader;