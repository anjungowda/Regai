import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import { cn } from '../../components/common/Button';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters with one uppercase letter and one number")
    .regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must be at least 8 characters with one uppercase letter and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, text: '', classes: ['bg-slate-200', 'bg-slate-200', 'bg-slate-200', 'bg-slate-200'] };
  
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/(?=.*[A-Z])/.test(pwd)) score += 1;
  if (/(?=.*\d)/.test(pwd)) score += 1;
  if (pwd.length >= 12 && score === 3) score += 1;

  if (pwd.length < 8) return { score: 1, text: 'Too short', classes: ['bg-red-500', 'bg-slate-200', 'bg-slate-200', 'bg-slate-200'] };
  if (score === 1) return { score: 2, text: 'Weak', classes: ['bg-amber-500', 'bg-amber-500', 'bg-slate-200', 'bg-slate-200'] };
  if (score === 2 || score === 3) return { score: 3, text: 'Fair', classes: ['bg-amber-500', 'bg-amber-500', 'bg-green-500', 'bg-slate-200'] };
  return { score: 4, text: 'Strong', classes: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] };
};

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    document.title = 'Create new password — RegShield AI';
  }, []);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const pwdValue = watch('password');
  const strength = getPasswordStrength(pwdValue);

  if (!token) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="This password reset link is invalid or has expired."
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center -mt-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <Button fullWidth onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}>
            Request a new reset link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError(null);
    const result = await resetPassword(token, data.password, data.confirmPassword);
    
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setServerError(result.error || 'This password reset link has expired or has already been used. Reset links are valid for 1 hour.');
    }
  };

  if (status === 'success') {
    return (
      <AuthLayout
        title="Password updated"
        subtitle="Your password has been updated successfully."
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center -mt-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <Button fullWidth onClick={() => navigate(ROUTES.AUTH.LOGIN, { state: { message: "Password updated successfully. Please log in." } })}>
            Log in now
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'error') {
    return (
        <AuthLayout
          title="Reset link expired"
          subtitle="This password reset link has expired or has already been used. Reset links are valid for 1 hour."
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center -mt-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 text-sm font-medium">{serverError}</p>
            <Button fullWidth onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}>
              Request a new reset link
            </Button>
          </div>
        </AuthLayout>
      );
  }

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Choose a strong password for your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="New password" error={errors.password?.message}>
          <div className="space-y-2">
            <Input 
              {...register('password')}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              error={!!errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            {/* Password strength indicator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex gap-1 h-1.5">
                {strength.classes.map((c, i) => (
                  <div key={i} className={cn("flex-1 rounded-full transition-colors", c)} />
                ))}
              </div>
              <span className="text-xs text-slate-500 w-12 text-right">{strength.text}</span>
            </div>
          </div>
        </FormField>

        <FormField label="Confirm new password" error={errors.confirmPassword?.message}>
          <Input 
            {...register('confirmPassword')}
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </FormField>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
          className="mt-4"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
