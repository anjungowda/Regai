import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const stateMessage = location.state?.message;
  const stateEmail = location.state?.email;

  useEffect(() => {
    document.title = 'Log in — RegShield AI';
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: stateEmail || '',
      rememberMe: false,
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    // MVP Demo Access Bypass
    if (data.email === 'demo@regshield.ai' && data.password === 'demo123') {
      navigate('/dashboard');
      return;
    }

    setServerError(null);
    const result = await login({ email: data.email, password: data.password });
    
    if (result.error) {
      setServerError(result.error);
    }
  };

  const isLockedOut = serverError?.includes('locked for 15 minutes');

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your RegShield AI workspace"
    >
      {stateMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3 mb-6">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{stateMessage}</p>
        </div>
      )}

      {serverError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium text-red-800">{serverError}</p>
            {isLockedOut && (
              <Button variant="outline" size="sm" onClick={() => window.location.href = ROUTES.AUTH.FORGOT_PASSWORD}>
                Reset password
              </Button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Email address" error={errors.email?.message}>
          <Input 
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            error={!!errors.email}
          />
        </FormField>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-sm font-medium text-[#1B4FD8] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input 
            {...register('password')}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            error={!!errors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          {errors.password && (
            <div className="text-red-600 text-sm mt-1 flex items-center gap-1.5" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input 
            type="checkbox"
            id="rememberMe"
            {...register('rememberMe')}
            className="w-4 h-4 text-[#1B4FD8] border-slate-300 rounded focus:ring-[#1B4FD8]"
          />
          <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer">
            Keep me logged in
          </label>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
          className="mt-2"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="text-center mt-8 text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to={ROUTES.AUTH.REGISTER} className="text-[#1B4FD8] font-medium hover:underline">
          Start your free trial
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
