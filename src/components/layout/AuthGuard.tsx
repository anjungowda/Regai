import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../constants';
import { useToast } from '../../hooks/useToast';

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  acceptedRoles?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireOnboarding = true,
  acceptedRoles
}) => {
  const location = useLocation();
  const { showToast } = useToast();
  const { user, isAuthenticated, isLoading, setLoading, setUser, setOrganisation, logout } = useAuthStore();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      if (initialCheckDone.current) return;
      initialCheckDone.current = true;

      if (!user) {
        try {
          const res = await authService.getMe();
          setUser(res.data.data.user as any);
          setOrganisation(res.data.data.organisation);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [user, setUser, setOrganisation, logout, setLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="flex items-center gap-2 mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1B4FD8]">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[#0F2557] font-bold text-xl">RegShield</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4FD8]"></div>
        <p className="mt-4 text-slate-500 text-sm">Loading your workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  const isUserOnboarded = (user as any).onboardingComplete;

  if (requireOnboarding && !isUserOnboarded && location.pathname !== ROUTES.PROTECTED.ONBOARDING) {
    return <Navigate to={ROUTES.PROTECTED.ONBOARDING} replace />;
  }

  if (isUserOnboarded && location.pathname === ROUTES.PROTECTED.ONBOARDING) {
    return <Navigate to={ROUTES.PROTECTED.DASHBOARD} replace />;
  }

  if (acceptedRoles && !acceptedRoles.includes(user.role)) {
    // We cannot securely call showToast directly in render for all cases, but we can Navigate.
    // Instead of rendering a Navigate directly with toast logic, we send them to dashboard.
    // We can showToast in a useEffect when this happens.
    return <Navigate to={ROUTES.PROTECTED.DASHBOARD} state={{ authError: "You don't have permission to access that page" }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
