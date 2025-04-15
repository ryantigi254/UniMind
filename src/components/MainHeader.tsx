import React from 'react';
import { Menu, User, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebarCollapse, toggleSidebar } = useStore();

  const handleToggle = () => {
    if (window.innerWidth >= 768) {
      toggleSidebarCollapse();
    } else {
      toggleSidebar();
    }
  };

  const handleAccountClick = () => {
    if (location.pathname === '/settings') {
      navigate('/');
    } else {
      navigate('/settings');
    }
  };

  const handleLogoClick = () => {
    if (isSidebarCollapsed) {
      window.location.reload();
    } else {
      navigate('/');
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
        <div className="flex items-center gap-2">
          {!isSidebarCollapsed && (
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 100 100"
                className="text-white"
                aria-hidden="true"
              >
                <rect width="60" height="45" x="20" y="35" rx="10" ry="10" fill="currentColor"/>
                <circle cx="38" cy="53" r="5" fill="#1F2937" />
                <circle cx="62" cy="53" r="5" fill="#1F2937" />
                <path d="M45 62 Q50 67 55 62" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <line x1="50" y1="25" x2="50" y2="35" stroke="currentColor" strokeWidth="3"/>
                <circle cx="50" cy="22" r="3" fill="currentColor"/>
              </svg>
            </div>
          )}
          <button
            onClick={handleLogoClick}
            className="text-3xl font-bold text-primary-500 hover:text-primary-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2"
          >
            UniMind
          </button>
        </div>
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
          onClick={handleAccountClick}
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