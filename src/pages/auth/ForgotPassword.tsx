import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    document.title = 'Reset password — RegShield AI';
  }, []);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setSubmittedEmail(data.email);
    await forgotPassword(data.email);
    setIsSuccess(true);
    setCooldown(60);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await forgotPassword(submittedEmail);
    setCooldown(60);
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Reset link sent"
        subtitle=""
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center -mt-6">
            <Mail className="w-8 h-8 text-[#0EA5E9]" />
          </div>
          
          <p className="text-slate-600 text-sm">
            If <strong>{submittedEmail}</strong> is registered, you'll receive a password reset email shortly. Check your spam folder if it doesn't arrive within a few minutes.
          </p>

          <p className="text-slate-500 text-xs">The link expires in 1 hour.</p>

          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => window.location.href = ROUTES.AUTH.LOGIN}
          >
            Back to log in
          </Button>

          <p className="text-sm text-slate-600">
            Didn't receive it?{' '}
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-[#1B4FD8] font-medium hover:underline disabled:text-slate-400 disabled:no-underline"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a reset link"
    >
      <div className="mb-6">
        <Link to={ROUTES.AUTH.LOGIN} className="text-sm text-slate-500 hover:text-slate-800 flex items-center transition-colors">
          &larr; Back to log in
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField label="Email address" error={errors.email?.message}>
          <Input 
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            error={!!errors.email}
          />
        </FormField>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
