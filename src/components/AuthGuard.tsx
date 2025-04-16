import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { session, disclaimerStatus, setUser } = useStore(state => ({
    session: state.session,
    disclaimerStatus: state.disclaimerStatus,
    setUser: state.setUser,
  }));

  useEffect(() => {
    if (session === null) {
      console.log("[AuthGuard] No session, redirecting to /auth");
      if (window.location.pathname !== '/auth') {
        navigate('/auth');
      }
    } else if (session?.user) {
      const currentUser = useStore.getState().user;
      if (currentUser?.id !== session.user.id) {
        console.log("[AuthGuard] Session user found, updating store user.");
        setUser(session.user);
      }
      
      if (!disclaimerStatus.accepted) {
        console.log("[AuthGuard] Session exists, but terms not accepted, redirecting to /terms");
        if (window.location.pathname !== '/terms') {
           navigate('/terms');
        }
      } else {
        console.log("[AuthGuard] Session exists and terms accepted.");
      }
    }
  }, [session, disclaimerStatus.accepted, navigate, setUser]);

  if (session && disclaimerStatus.accepted) {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;