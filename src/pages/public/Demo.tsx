import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ArrowRight, CalendarCheck } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import MetaTags from '../../components/common/MetaTags';
import { ROUTES } from '../../constants';
import { format, addDays } from 'date-fns';

const demoSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string()
    .email('Please enter a valid email address')
    .refine((val) => {
      const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const domain = val.split('@')[1]?.toLowerCase();
      return !personalDomains.includes(domain);
    }, 'Please use your work email address'),
  companyName: z.string().min(2, 'Company Name is required'),
  jobTitle: z.string().min(2, 'Job Title is required'),
  teamSize: z.string().min(1, 'Please select a team size'),
  challenge: z.string().min(10, 'Please provide more detail (minimum 10 characters)'),
  preferredDate: z.string().refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Must be at least tomorrow
    const minDate = addDays(today, 1);
    if (date < minDate) return false;
    // Disable weekends
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    return true;
  }, 'Please select a weekday (Monday–Friday) starting from tomorrow'),
  preferredTime: z.string().min(1, 'Please select a preferred time slot'),
  source: z.string().optional()
});

type DemoFormData = z.infer<typeof demoSchema>;

const Demo: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ date: string; time: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
  });

  const onSubmit = async (data: DemoFormData) => {
    setIsError(false);
    try {
      await axiosInstance.post('/demo', data);
      setSubmittedData({ date: data.preferredDate, time: data.preferredTime });
      setIsSuccess(true);
    } catch (error) {
      console.error('Demo request error:', error);
      setIsError(true);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const min = addDays(today, 1);
    return format(min, 'yyyy-MM-dd');
  };

  return (
    <div className="flex flex-col w-full font-interface bg-white relative py-16 px-4 sm:px-6 lg:px-8">
      <MetaTags 
        title="Book a Demo" 
        description="See how RegShield AI can transform your compliance operations. Demo calls are 30 minutes and led by Anju, our founder." 
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start animate-fade-in-up">
        
        {/* LEFT — Demo Request Form (60%) */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#0F2557] mb-6">Book your free demo</h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10 pb-10 border-b border-slate-200">
            See how RegShield AI can transform your compliance operations. Demo calls are 30 minutes and led by Anju, our founder.
          </p>

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 flex items-start gap-3" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Something went wrong submitting your request. Please email us directly at info@regshield.ai</p>
            </div>
          )}

          {isSuccess && submittedData ? (
            <div className="bg-[#0F2557] rounded-2xl p-10 text-center flex flex-col items-center shadow-2xl relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B4FD8] rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
              <CalendarCheck className="w-20 h-20 text-[#0EA5E9] mb-6 relative z-10" />
              <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Demo request received</h2>
              <p className="text-slate-300 mb-8 max-w-sm relative z-10 leading-relaxed">
                Anju will email you within 4 business hours to confirm your slot for:
                <br/><strong className="text-white mt-2 block bg-white/10 py-2 rounded-lg">
                  {format(new Date(submittedData.date), 'EEEE, MMMM do')} at {submittedData.time}
                </strong>
              </p>
              <div className="w-full h-px bg-white/20 mb-8 relative z-10"></div>
              <p className="text-sm text-slate-400 mb-4 relative z-10">In the meantime, explore the platform overview:</p>
              <Link 
                to={ROUTES.PUBLIC.FEATURES}
                className="inline-flex items-center gap-2 text-white font-bold bg-[#1B4FD8] hover:bg-[#0EA5E9] transition-colors px-6 py-3 rounded-lg relative z-10"
              >
                View Platform Features <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                  />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1" role="alert">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Work Email *</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1" role="alert">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                  <input
                    id="companyName"
                    type="text"
                    {...register('companyName')}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.companyName ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                  />
                  {errors.companyName && <p className="text-red-600 text-sm mt-1" role="alert">{errors.companyName.message}</p>}
                </div>
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                  <input
                    id="jobTitle"
                    type="text"
                    {...register('jobTitle')}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.jobTitle ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                  />
                  {errors.jobTitle && <p className="text-red-600 text-sm mt-1" role="alert">{errors.jobTitle.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="teamSize" className="block text-sm font-semibold text-slate-700 mb-2">Compliance team size *</label>
                <select
                  id="teamSize"
                  {...register('teamSize')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.teamSize ? 'border-red-500 bg-red-50' : 'border-slate-300'} bg-white focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                >
                  <option value="">Please select...</option>
                  <option value="Just me">Just me</option>
                  <option value="2–5 people">2–5 people</option>
                  <option value="6–10 people">6–10 people</option>
                  <option value="10+ people">10+ people</option>
                </select>
                {errors.teamSize && <p className="text-red-600 text-sm mt-1" role="alert">{errors.teamSize.message}</p>}
              </div>

              <div>
                 <label htmlFor="challenge" className="block text-sm font-semibold text-slate-700 mb-2">Biggest compliance challenge *</label>
                 <textarea
                   id="challenge"
                   rows={3}
                   placeholder="e.g. We currently track all cases in spreadsheets and struggle with audit preparation..."
                   {...register('challenge')}
                   className={`w-full px-4 py-3 rounded-lg border ${errors.challenge ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all resize-none`}
                 ></textarea>
                 {errors.challenge && <p className="text-red-600 text-sm mt-1" role="alert">{errors.challenge.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-semibold text-slate-700 mb-2">Preferred demo date *</label>
                  <input
                    id="preferredDate"
                    type="date"
                    min={getMinDate()}
                    {...register('preferredDate')}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.preferredDate ? 'border-red-500 bg-red-50' : 'border-slate-300'} bg-white focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                  />
                  {errors.preferredDate && <p className="text-red-600 text-sm mt-1" role="alert">{errors.preferredDate.message}</p>}
                </div>
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-semibold text-slate-700 mb-2">Preferred time slot *</label>
                  <select
                    id="preferredTime"
                    {...register('preferredTime')}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.preferredTime ? 'border-red-500 bg-red-50' : 'border-slate-300'} bg-white focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                  >
                    <option value="">Please select...</option>
                    <option value="9:00am–10:00am (GMT)">9:00am–10:00am (GMT)</option>
                    <option value="10:00am–11:00am (GMT)">10:00am–11:00am (GMT)</option>
                    <option value="11:00am–12:00pm (GMT)">11:00am–12:00pm (GMT)</option>
                    <option value="2:00pm–3:00pm (GMT)">2:00pm–3:00pm (GMT)</option>
                    <option value="3:00pm–4:00pm (GMT)">3:00pm–4:00pm (GMT)</option>
                  </select>
                  {errors.preferredTime && <p className="text-red-600 text-sm mt-1" role="alert">{errors.preferredTime.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-semibold text-slate-700 mb-2">How did you hear about us? (Optional)</label>
                <select
                  id="source"
                  {...register('source')}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all bg-white"
                >
                  <option value="">Please select...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="FinCrimeJobs">FinCrimeJobs</option>
                  <option value="2LOD Community">2LOD Community</option>
                  <option value="Financial Crime Community">Financial Crime Community</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B4FD8] text-white font-bold text-xl py-5 rounded-xl hover:bg-[#0F2557] transition-all shadow-xl hover:shadow-2xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Processing Request...</>
                ) : (
                  'Request Demo'
                )}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT — What to Expect (40%) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-[#F8FAFC] rounded-2xl p-8 border border-slate-200 shadow-sm">
             <h3 className="text-2xl font-bold text-[#0F2557] mb-8">What happens next</h3>
             
             <div className="space-y-8 mb-10">
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#1B4FD8] text-white font-bold flex items-center justify-center flex-shrink-0 border-4 border-blue-100">1</div>
                 <div>
                   <h4 className="font-bold text-[#0F2557] text-lg mb-1">We confirm your slot</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">Anju will email you within 4 business hours to confirm your requested date and time.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#1B4FD8] text-white font-bold flex items-center justify-center flex-shrink-0 border-4 border-blue-100">2</div>
                 <div>
                   <h4 className="font-bold text-[#0F2557] text-lg mb-1">30-minute walkthrough</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">Anju will show you the platform live — case management, risk scoring, evidence vault and audit trail — tailored to your compliance challenges.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#1B4FD8] text-white font-bold flex items-center justify-center flex-shrink-0 border-4 border-blue-100">3</div>
                 <div>
                   <h4 className="font-bold text-[#0F2557] text-lg mb-1">Your questions answered</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">No sales pressure. Ask anything about the platform, pricing or how it fits your specific regulatory environment.</p>
                 </div>
               </div>
             </div>

             <div className="border-t border-slate-200 pt-8 mb-8">
               <h4 className="font-bold text-[#0F2557] mb-4">What you'll see</h4>
               <ul className="space-y-3">
                 <li className="flex items-start gap-3"><ArrowRight className="w-4 h-4 text-[#1B4FD8] mt-0.5" /><span className="text-slate-700 text-sm font-medium">Live case management workflow from alert to closure</span></li>
                 <li className="flex items-start gap-3"><ArrowRight className="w-4 h-4 text-[#1B4FD8] mt-0.5" /><span className="text-slate-700 text-sm font-medium">Risk scoring engine with full methodology breakdown</span></li>
                 <li className="flex items-start gap-3"><ArrowRight className="w-4 h-4 text-[#1B4FD8] mt-0.5" /><span className="text-slate-700 text-sm font-medium">Evidence vault and audit trail demonstration</span></li>
                 <li className="flex items-start gap-3"><ArrowRight className="w-4 h-4 text-[#1B4FD8] mt-0.5" /><span className="text-slate-700 text-sm font-medium">Compliance template library walkthrough</span></li>
               </ul>
             </div>

             <div className="bg-[#0F2557] text-white rounded-xl p-6 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#1B4FD8] rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
               <p className="text-sm font-medium leading-relaxed italic relative z-10 mb-4">
                 "Demo calls are led by Anju directly — a compliance practitioner who has worked in UK-regulated financial institutions. You will speak to someone who understands your workflows."
               </p>
               <div className="relative z-10 text-xs font-bold text-[#0EA5E9] uppercase tracking-widest">— RegShield AI</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Demo;
