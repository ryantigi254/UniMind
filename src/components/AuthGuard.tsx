import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { session, setUser } = useStore();

  useEffect(() => {
    if (session === null) {
      if (window.location.pathname !== '/auth') {
        navigate('/auth');
      }
    } else if (session?.user) {
      const currentUser = useStore.getState().user;
      if (currentUser?.id !== session.user.id) {
        setUser(session.user);
      }
    }
  }, [session, navigate, setUser]);

  return session ? <>{children}</> : null;
};

export default AuthGuard;