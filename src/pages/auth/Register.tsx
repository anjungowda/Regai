import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import { cn } from '../../components/common/Button';

const registerSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters with one uppercase letter and one number")
    .regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must be at least 8 characters with one uppercase letter and one number"),
  confirmPassword: z.string(),
  orgName: z.string().min(2, "Please enter your organisation name"),
  planType: z.enum(['standard', 'professional']),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms of Service and Privacy Policy" })
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, text: '', classes: ['bg-slate-200', 'bg-slate-200', 'bg-slate-200', 'bg-slate-200'] };
  
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/(?=.*[A-Z])/.test(pwd)) score += 1;
  if (/(?=.*\d)/.test(pwd)) score += 1;
  if (pwd.length >= 12 && score === 3) score += 1; // Bonus for length if valid

  if (pwd.length < 8) return { score: 1, text: 'Too short', classes: ['bg-red-500', 'bg-slate-200', 'bg-slate-200', 'bg-slate-200'] };
  if (score === 1) return { score: 2, text: 'Weak', classes: ['bg-amber-500', 'bg-amber-500', 'bg-slate-200', 'bg-slate-200'] };
  if (score === 2 || score === 3) return { score: 3, text: 'Fair', classes: ['bg-amber-500', 'bg-amber-500', 'bg-green-500', 'bg-slate-200'] };
  return { score: 4, text: 'Strong', classes: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] };
};

const Register: React.FC = () => {
  const { register: registerCall } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const initialPlan = searchParams.get('plan') === 'professional' ? 'professional' : 'standard';

  useEffect(() => {
    document.title = 'Create Account — RegShield AI';
  }, []);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      planType: initialPlan,
    }
  });

  const pwdValue = watch('password');
  const planValue = watch('planType');
  const strength = getPasswordStrength(pwdValue);

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    const result = await registerCall(data);
    
    if (result.error) {
      setServerError(result.error);
    }
  };

  const emailInUse = serverError?.toLowerCase().includes("email address already registered") || serverError?.toLowerCase().includes("exists");

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your 14-day free trial. No credit card required."
    >
      {serverError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-medium text-red-800">
              {emailInUse ? "Email address already registered" : serverError}
            </p>
            {emailInUse && (
              <Link to={ROUTES.AUTH.LOGIN} className="text-sm underline text-red-700 hover:text-red-900 mt-1">
                Log in instead?
              </Link>
            )}
            {!emailInUse && <p className="text-sm text-red-700 mt-1">Something went wrong. Please try again.</p>}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Full name" error={errors.fullName?.message}>
          <Input 
            {...register('fullName')}
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            error={!!errors.fullName}
          />
        </FormField>

        <FormField label="Work email address" error={errors.email?.message}>
          <Input 
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="jane@yourcompany.com"
            error={!!errors.email}
          />
        </FormField>

        <FormField label="Organisation name" error={errors.orgName?.message}>
          <Input 
            {...register('orgName')}
            type="text"
            autoComplete="organization"
            placeholder="Acme Payments Ltd"
            error={!!errors.orgName}
          />
        </FormField>

        <div className="pt-2 pb-1">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Select your plan</label>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Standard Plan */}
            <div 
              onClick={() => setValue('planType', 'standard', { shouldValidate: true })}
              className={cn(
                "flex-1 border-2 rounded-xl p-4 cursor-pointer transition-colors",
                planValue === 'standard' ? "border-[#1B4FD8] bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="font-semibold text-slate-900">Standard</div>
              <div className="text-[#1B4FD8] font-bold mt-1">£99/month</div>
              <div className="text-xs text-slate-500 mt-2">50 cases · 5GB · Email support</div>
            </div>

            {/* Pro Plan */}
            <div 
              onClick={() => setValue('planType', 'professional', { shouldValidate: true })}
              className={cn(
                "flex-1 border-2 rounded-xl p-4 cursor-pointer transition-colors relative",
                planValue === 'professional' ? "border-[#1B4FD8] bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="absolute -top-3 right-3 bg-[#0EA5E9] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Most Popular
              </div>
              <div className="font-semibold text-slate-900">Professional</div>
              <div className="text-[#1B4FD8] font-bold mt-1">£199/month</div>
              <div className="text-xs text-slate-500 mt-2">Unlimited · 25GB · Priority support</div>
            </div>
          </div>
        </div>

        <FormField label="Password" error={errors.password?.message}>
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

        <FormField label="Confirm password" error={errors.confirmPassword?.message}>
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

        <div className="pt-2">
          <div className="flex items-start gap-2 border border-transparent">
            <input 
              type="checkbox"
              id="agreedToTerms"
              {...register('agreedToTerms')}
              className={cn(
                "mt-1 w-4 h-4 rounded focus:ring-[#1B4FD8] cursor-pointer",
                errors.agreedToTerms ? "border-red-400 text-red-600 focus:ring-red-500" : "text-[#1B4FD8] border-slate-300"
              )}
            />
            <label htmlFor="agreedToTerms" className="text-sm text-slate-600 cursor-pointer pt-0.5 leading-snug">
              I agree to the <Link to={ROUTES.PUBLIC.TERMS} className="text-[#1B4FD8] hover:underline" target="_blank">Terms of Service</Link> and <Link to={ROUTES.PUBLIC.PRIVACY} className="text-[#1B4FD8] hover:underline" target="_blank">Privacy Policy</Link>
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-red-600 text-sm mt-1">{errors.agreedToTerms.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
          className="mt-4"
        >
          {isSubmitting ? "Creating your account..." : "Create account"}
        </Button>
      </form>

      <div className="text-center mt-8 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to={ROUTES.AUTH.LOGIN} className="text-[#1B4FD8] font-medium hover:underline">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
