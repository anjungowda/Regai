import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Mail, Clock, Linkedin, AlertCircle, Loader2 } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import MetaTags from '../../components/common/MetaTags';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required and must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  companyName: z.string().min(2, 'Company Name is required'),
  jobTitle: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters long'),
  source: z.string().optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsError(false);
    try {
      await axiosInstance.post('/contact', data); // Maps to VITE_API_URL/contact
      setIsSuccess(true);
    } catch (error) {
      console.error('Contact submission error:', error);
      setIsError(true);
    }
  };

  const handleReset = () => {
    reset();
    setIsSuccess(false);
    setIsError(false);
  };

  return (
    <div className="flex flex-col w-full font-interface min-h-[calc(100vh-80px)] bg-slate-50 relative py-12 px-4 sm:px-6 lg:px-8">
      <MetaTags 
        title="Contact Us" 
        description="Get in touch with RegShield AI. Speak directly to our founder and compliance experts." 
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 animate-fade-in-up">
        
        {/* LEFT — Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-[#0F2557] mb-8">Send us a message</h1>

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Something went wrong. Please email us directly at info@regshield.ai</p>
            </div>
          )}

          {isSuccess ? (
            <div className="bg-[#F6fdf9] border-2 border-green-200 rounded-xl p-8 text-center flex flex-col items-center animate-fade-in-up">
              <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
              <h2 className="text-2xl font-bold text-[#0F2557] mb-3">Message sent successfully</h2>
              <p className="text-slate-600 mb-8 max-w-sm">Thank you for getting in touch. We will respond within 1 business day.</p>
              <button 
                onClick={handleReset}
                className="text-[#1B4FD8] font-bold text-sm hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                />
                {errors.fullName && <p className="text-red-600 text-sm mt-1" role="alert" aria-describedby="fullName">{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all`}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1" role="alert" aria-describedby="email">{errors.email.message}</p>}
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
                  <label htmlFor="jobTitle" className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                  <input
                    id="jobTitle"
                    type="text"
                    {...register('jobTitle')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-semibold text-slate-700 mb-2">How did you hear about us?</label>
                <select
                  id="source"
                  {...register('source')}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all bg-white"
                >
                  <option value="">Please select...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="Financial Crime Community">Financial Crime Community</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                 <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                 <textarea
                   id="message"
                   rows={5}
                   {...register('message')}
                   className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] outline-none transition-all resize-none`}
                 ></textarea>
                 {errors.message && <p className="text-red-600 text-sm mt-1" role="alert">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0F2557] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#1B4FD8] transition-colors shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending...</>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT — Contact Information */}
        <div className="lg:py-8 lg:pr-8">
           <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Get in touch</h2>
           <p className="text-lg text-slate-600 leading-relaxed mb-10">
             All enquiries are handled directly by our founder. You will speak to someone who understands compliance.
           </p>

           <div className="space-y-8 mb-12">
             <div className="flex items-start gap-4">
               <div className="bg-blue-100 p-3 rounded-xl"><Mail className="w-6 h-6 text-[#1B4FD8]" /></div>
               <div>
                 <p className="text-sm font-semibold text-slate-500 mb-1">Email us</p>
                 <a href="mailto:info@regshield.ai" className="text-[#1B4FD8] font-bold text-lg hover:underline">info@regshield.ai</a>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="bg-blue-100 p-3 rounded-xl"><Clock className="w-6 h-6 text-[#1B4FD8]" /></div>
               <div>
                 <p className="text-sm font-semibold text-slate-500 mb-1">Response time</p>
                 <p className="text-[#0F2557] font-bold text-lg">We aim to respond within 1 business day</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="bg-blue-100 p-3 rounded-xl"><Linkedin className="w-6 h-6 text-[#1B4FD8]" /></div>
               <div>
                 <p className="text-sm font-semibold text-slate-500 mb-1">Social</p>
                 <a href="#" target="_blank" rel="noopener noreferrer" className="text-[#1B4FD8] font-bold text-lg hover:underline">Connect with Anju on LinkedIn</a>
               </div>
             </div>
           </div>

           <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 shadow-sm">
             <p className="text-[#0F2557] font-medium leading-relaxed italic relative z-10">
               "RegShield AI is built by a compliance practitioner who has worked in UK-regulated financial institutions. When you reach out, you are speaking to someone who understands your workflow challenges first-hand."
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
