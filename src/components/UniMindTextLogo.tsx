import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const UniMindTextLogo: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();
  const { user } = useStore((state) => ({ user: state.user }));

  const handleLogoClick = () => {
    if (user) {
      navigate('/'); // Go home if logged in
    } else {
      navigate('/auth'); // Go to auth if logged out
    }
  };

  return (
    <button
      onClick={handleLogoClick}
      className={`text-3xl font-bold text-primary-500 hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 ${className}`}
      aria-label="Go to homepage"
    >
      UniMind
    </button>
  );
};

export default UniMindTextLogo; 