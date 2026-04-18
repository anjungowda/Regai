import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { AlertTriangle, Briefcase, Building, TrendingUp, Gift, Home, HelpCircle, Shield, CheckCircle, Clock } from 'lucide-react';
import { RiskResultsPanel } from './RiskResultsPanel';

const FATF_GREY_LIST = ['AL', 'BB', 'BF', 'CM', 'KY', 'CD', 'HT', 'JM', 'JO', 'ML', 'MZ', 'NG', 'PA', 'PH', 'SN', 'ZA', 'SS', 'SY', 'TZ', 'TR', 'UG', 'AE', 'VN', 'YE'];
const SANCTIONED_COUNTRIES = ['BY', 'CU', 'IR', 'MM', 'KP', 'RU', 'SD', 'VE'];
const LOW_RISK_COUNTRIES = ['GB', 'US', 'CA', 'AU', 'NZ', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH', 'AT', 'BE', 'IE', 'LU', 'SG', 'JP', 'HK'];

export const IndividualScoringForm = ({ linkedCaseId, linkedCustomerId }: any) => {
  const { register, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      country: '', occupation: '', sourceOfFunds: '', pepStatus: '',
      sanctions: '', txVolume: '', relationshipDuration: '', adverseMedia: '',
      adverseMediaDetails: ''
    }
  });

  const formValues = watch();

  const scoreData = useMemo(() => {
    let total = 0;
    const items = [];

    // F1: Country
    if (formValues.country) {
      let pts = 5;
      if (LOW_RISK_COUNTRIES.includes(formValues.country)) pts = 0;
      else if (FATF_GREY_LIST.includes(formValues.country)) pts = 15;
      else if (SANCTIONED_COUNTRIES.includes(formValues.country)) pts = 30;
      total += pts;
      items.push({ name: 'Country of Residence', value: formValues.country, pts });
    }

    // F2: Occupation
    if (formValues.occupation) {
      const oc = formValues.occupation;
      let pts = 0;
      if (oc === 'med') pts = 5;
      if (oc === 'high') pts = 8;
      if (oc === 'crit') pts = 12;
      total += pts;
      items.push({ name: 'Occupation / Industry', value: 'Selected Category', pts });
    }

    // F3: Source of Funds
    if (formValues.sourceOfFunds) {
      const sf = formValues.sourceOfFunds;
      let pts = 0;
      if (sf === 'invest') pts = 3;
      if (sf === 'property') pts = 5;
      if (sf === 'gift') pts = 8;
      if (sf === 'unknown') pts = 20;
      total += pts;
      items.push({ name: 'Source of Funds', value: sf, pts });
    }

    // F4: PEP
    if (formValues.pepStatus) {
      const pts = formValues.pepStatus === 'yes' ? 20 : 0;
      total += pts;
      items.push({ name: 'PEP Status', value: formValues.pepStatus === 'yes' ? 'Is a PEP' : 'Not a PEP', pts });
    }

    // F5: Sanctions
    if (formValues.sanctions) {
      let pts = 0;
      if (formValues.sanctions === 'potential') pts = 10;
      if (formValues.sanctions === 'confirmed') pts = 30;
      total += pts;
      items.push({ name: 'Sanctions Screening', value: formValues.sanctions, pts });
    }

    // F6: Vol
    if (formValues.txVolume) {
      let pts = 0;
      if (formValues.txVolume === 'v2') pts = 5;
      if (formValues.txVolume === 'v3') pts = 8;
      if (formValues.txVolume === 'v4') pts = 12;
      total += pts;
      items.push({ name: 'Expected Tx Volume', value: formValues.txVolume, pts });
    }

    // F7: Duration
    if (formValues.relationshipDuration) {
      let pts = 0;
      if (formValues.relationshipDuration === 'new') pts = 5;
      if (formValues.relationshipDuration === '1y') pts = 3;
      if (formValues.relationshipDuration === '3y') pts = 1;
      total += pts;
      items.push({ name: 'Relationship Duration', value: formValues.relationshipDuration, pts });
    }

    // F8: Media
    if (formValues.adverseMedia) {
      const pts = formValues.adverseMedia === 'yes' ? 15 : 0;
      total += pts;
      items.push({ name: 'Adverse Media Findings', value: formValues.adverseMedia === 'yes' ? 'Identified' : 'None', pts });
    }

    return { score: Math.min(total, 100), breakdown: items };
  }, [JSON.stringify(formValues)]);

  const { score, breakdown } = scoreData;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT: FORM */}
      <div className="lg:w-3/5 space-y-6">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
          
          {/* F1 */}
          <div>
            <label className="text-sm font-bold text-slate-800 mb-2 block">Country of Residence</label>
            <select {...register('country')} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#1B4FD8] outline-none transition">
              <option value="">Select country...</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="US">United States (US)</option>
              <option value="NG">Nigeria (NG) - FATF Grey List (15 pts)</option>
              <option value="RU">Russia (RU) - Sanctioned (30 pts)</option>
            </select>
          </div>

          {/* F2 */}
          <div>
            <label className="text-sm font-bold text-slate-800 mb-2 block">Occupation or Industry</label>
            <select {...register('occupation')} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#1B4FD8] outline-none transition">
              <option value="">Select industry classification...</option>
              <optgroup label="Low Risk (0 pts)">
                <option value="low">Employed — Financial Services</option>
                <option value="low">Employed — Technology</option>
              </optgroup>
              <optgroup label="Medium Risk (5 pts)">
                <option value="med">Self-employed / Small business owner</option>
              </optgroup>
              <optgroup label="High Risk (8 pts)">
                <option value="high">Cash-intensive business (retail/hospitality)</option>
                <option value="high">Accountant / Tax adviser</option>
              </optgroup>
              <optgroup label="Very High Risk (12 pts)">
                <option value="crit">Crypto / Virtual asset business</option>
                <option value="crit">Gambling operator</option>
              </optgroup>
            </select>
          </div>

          {/* F3 */}
          <div>
            <label className="text-sm font-bold text-slate-800 mb-2 block">Primary Source of Funds</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'emp', label: 'Employment income', icon: <Briefcase className="w-5 h-5"/> },
                { id: 'bus', label: 'Business income', icon: <Building className="w-5 h-5"/> },
                { id: 'invest', label: 'Investment/dividends', icon: <TrendingUp className="w-5 h-5"/> },
                { id: 'gift', label: 'Inheritance/Gift', icon: <Gift className="w-5 h-5"/> },
                { id: 'property', label: 'Property sale', icon: <Home className="w-5 h-5"/> },
                { id: 'unknown', label: 'Unknown / Unclear', icon: <HelpCircle className="w-5 h-5"/> }
              ].map(opt => (
                <label key={opt.id} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-colors text-center ${formValues.sourceOfFunds === opt.id ? 'border-[#1B4FD8] bg-blue-50 text-blue-900 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                  <input type="radio" value={opt.id} {...register('sourceOfFunds')} className="hidden" />
                  <div className={`mb-2 ${formValues.sourceOfFunds === opt.id ? 'text-[#1B4FD8]' : ''}`}>{opt.icon}</div>
                  <span className="text-xs font-bold">{opt.label}</span>
                </label>
              ))}
            </div>
            {formValues.sourceOfFunds === 'unknown' && (
              <div className="mt-3 bg-red-50 text-red-800 border border-red-200 rounded-lg p-3 text-sm font-medium flex gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" /> Unknown source of funds significantly increases risk. Obtain source of funds documentation before proceeding.
              </div>
            )}
          </div>

          {/* F4 */}
          <div>
            <label className="text-sm font-bold text-slate-800 mb-2 block">Politically Exposed Person (PEP) Status</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formValues.pepStatus === 'no' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" value="no" {...register('pepStatus')} className="hidden" />
                <Shield className={`w-6 h-6 ${formValues.pepStatus === 'no' ? 'text-green-600' : 'text-slate-400'}`} />
                <span className={`text-sm font-bold ${formValues.pepStatus === 'no' ? 'text-green-900' : 'text-slate-700'}`}>Not a PEP (0 pts)</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formValues.pepStatus === 'yes' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" value="yes" {...register('pepStatus')} className="hidden" />
                <AlertTriangle className={`w-6 h-6 ${formValues.pepStatus === 'yes' ? 'text-red-600' : 'text-slate-400'}`} />
                <span className={`text-sm font-bold ${formValues.pepStatus === 'yes' ? 'text-red-900' : 'text-slate-700'}`}>Is a PEP or Associate (20 pts)</span>
              </label>
            </div>
            {formValues.pepStatus === 'yes' && (
              <div className="mt-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-3 text-sm font-medium">
                PEPs require Enhanced Due Diligence under the Money Laundering Regulations 2017. Obtain senior management approval before onboarding.
              </div>
            )}
          </div>

          {/* F5 */}
          <div>
            <label className="text-sm font-bold text-slate-800 mb-2 block">Sanctions Screening Result</label>
            <div className="grid grid-cols-1 gap-3">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formValues.sanctions === 'none' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" value="none" {...register('sanctions')} className="hidden" />
                <CheckCircle className={`w-5 h-5 ${formValues.sanctions === 'none' ? 'text-green-600' : 'text-slate-400'}`} />
                <span className={`text-sm font-bold ${formValues.sanctions === 'none' ? 'text-green-900' : 'text-slate-700'}`}>No match found (0 pts)</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formValues.sanctions === 'potential' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" value="potential" {...register('sanctions')} className="hidden" />
                <Clock className={`w-5 h-5 ${formValues.sanctions === 'potential' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className={`text-sm font-bold ${formValues.sanctions === 'potential' ? 'text-amber-900' : 'text-slate-700'}`}>Potential match — under review (10 pts)</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formValues.sanctions === 'confirmed' ? 'border-red-600 bg-red-100' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" value="confirmed" {...register('sanctions')} className="hidden" />
                <AlertTriangle className={`w-5 h-5 ${formValues.sanctions === 'confirmed' ? 'text-red-700' : 'text-slate-400'}`} />
                <span className={`text-sm font-bold ${formValues.sanctions === 'confirmed' ? 'text-red-900' : 'text-slate-700'}`}>Confirmed sanctions match (30 pts)</span>
              </label>
            </div>
            {formValues.sanctions === 'confirmed' && (
              <div className="mt-4 bg-red-600 text-white border border-red-700 rounded-xl p-4 text-sm font-bold flex gap-3 animate-in slide-in-from-top-2">
                <AlertTriangle className="w-8 h-8 shrink-0" />
                <p>⛔ CONFIRMED SANCTIONS MATCH: Do not proceed with this transaction or business relationship. Submit a SAR to the National Crime Agency immediately. Do not inform the customer (tipping off offence).</p>
              </div>
            )}
          </div>

          {/* F6 & F7 Inline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="text-sm font-bold text-slate-800 mb-2 block">Expected Monthly Tx Volume</label>
                <div className="flex flex-col gap-2">
                  {['Under £10,000 (0 pts)', '£10,000 – £50,000 (5 pts)', '£50,000 – £100,000 (8 pts)', 'Over £100,000 (12 pts)'].map((opt, i) => {
                    const v = `v${i+1}`;
                    return <label key={v} className={`px-4 py-2 text-xs font-bold border-2 rounded-lg cursor-pointer ${formValues.txVolume === v ? 'border-[#1B4FD8] bg-blue-50 text-blue-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}><input type="radio" value={v} {...register('txVolume')} className="hidden"/>{opt}</label>;
                  })}
                </div>
             </div>
             <div>
                <label className="text-sm font-bold text-slate-800 mb-2 block">Relationship Duration</label>
                <div className="flex flex-col gap-2">
                  {['New customer (5 pts)', 'Under 1 year (3 pts)', '1–3 years (1 pt)', 'Over 3 years (0 pts)'].map((opt, i) => {
                    const v = ['new', '1y', '3y', 'old'][i];
                    return <label key={v} className={`px-4 py-2 text-xs font-bold border-2 rounded-lg cursor-pointer ${formValues.relationshipDuration === v ? 'border-[#1B4FD8] bg-blue-50 text-blue-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}><input type="radio" value={v} {...register('relationshipDuration')} className="hidden"/>{opt}</label>;
                  })}
                </div>
             </div>
          </div>

          {/* F8 */}
          <div>
             <label className="text-sm font-bold text-slate-800 mb-2 block">Adverse Media Findings</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formValues.adverseMedia === 'no' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" value="no" {...register('adverseMedia')} className="hidden" />
                <span className={`text-sm font-bold ${formValues.adverseMedia === 'no' ? 'text-green-900' : 'text-slate-700'}`}>No adverse media found (0 pts)</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formValues.adverseMedia === 'yes' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" value="yes" {...register('adverseMedia')} className="hidden" />
                <span className={`text-sm font-bold ${formValues.adverseMedia === 'yes' ? 'text-red-900' : 'text-slate-700'}`}>Adverse media identified (15 pts)</span>
              </label>
            </div>
            {formValues.adverseMedia === 'yes' && (
              <textarea 
                {...register('adverseMediaDetails')} 
                placeholder="Describe the adverse media finding..."
                className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#1B4FD8] outline-none transition"
              />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: LIVE RESULTS */}
      <div className="lg:w-2/5">
        <div className="sticky top-[100px]">
          <RiskResultsPanel score={score} breakdown={breakdown} isComplete={breakdown.length === 8} />
        </div>
      </div>
    </div>
  );
};
