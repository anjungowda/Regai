import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService, LoginPayload, RegisterPayload } from '../services/auth.service';
import { ROUTES } from '../constants';

export function useAuth() {
  const navigate = useNavigate();
  const { user, organisation, isAuthenticated, isLoading, setUser, setOrganisation, setLoading, logout: _logoutStore } = useAuthStore();

  const login = async (payload: LoginPayload) => {
    try {
      const response = await authService.login(payload);
      const resUser = response.data.data.user as any;
      
      setUser(resUser);
      setOrganisation(response.data.data.organisation);
      
      if (resUser.onboardingComplete === false) {
        navigate(ROUTES.PROTECTED.ONBOARDING);
      } else {
        navigate(ROUTES.PROTECTED.DASHBOARD);
      }
      return { success: true };
    } catch (error: any) {
      if (error.response?.data?.error) {
        return { error: error.response.data.error };
      }
      return { error: 'Incorrect email or password. Please try again.' };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await authService.register(payload);
      
      setUser(response.data.data.user as any);
      setOrganisation(response.data.data.organisation);
      
      navigate(ROUTES.PROTECTED.ONBOARDING);
      return { success: true };
    } catch (error: any) {
      if (error.response?.data?.error) {
        return { error: error.response.data.error };
      }
      return { error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // fire and forget
    } finally {
      _logoutStore();
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      return { success: true, message: 'Reset link sent' };
    } catch (error: any) {
      // Security: always resolving success regardless of whether email exists locally
      return { success: true, message: 'Reset link sent' };
    }
  };

  const resetPassword = async (token: string, password: string, confirm: string) => {
    try {
      await authService.resetPassword(token, password, confirm);
      return { success: true, message: 'Password updated successfully. Please log in.' };
    } catch (error: any) {
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      return { success: false, error: 'Failed to reset password. Please try again.' };
    }
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'compliance_manager' || isAdmin;
  const isAnalyst = ['admin', 'compliance_manager', 'analyst', 'reviewer'].includes(user?.role || '');
  const isAuditor = user?.role === 'auditor';

  const canManageCases = isAnalyst;
  const canApproveDecisions = isManager;
  const canManageUsers = isAdmin;

  return {
    user,
    organisation,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin,
    isManager,
    isAnalyst,
    isAuditor,
    canManageCases,
    canApproveDecisions,
    canManageUsers,
  };
}
