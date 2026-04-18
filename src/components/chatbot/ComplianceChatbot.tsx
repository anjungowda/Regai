import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minus, ShieldCheck, Send } from 'lucide-react';
import { findBestMatch } from '../../utils/chatbotMatcher';
import { Link } from 'react-router-dom';

export const ComplianceChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: number; text: string; sender: 'user' | 'bot'; relatedAction?: any }[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial silent payload
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(),
        text: "Hello! I'm your RegShield AI compliance assistant. I can answer questions about AML regulations and platform operations.",
        sender: 'bot'
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
    setInputVal('');
    setIsTyping(true);

    // Simulate Network Latency
    setTimeout(() => {
      const match = findBestMatch(userMsg);
      if (match) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          text: match.answer, 
          sender: 'bot',
          relatedAction: match.relatedAction 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          text: "I don't have a specific answer mapped for that query. For urgent regulatory questions, contact info@regshield.ai.", 
          sender: 'bot' 
        }]);
      }
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputVal);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#1B4FD8] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-800 transition z-50 hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[85vw] sm:w-[350px] bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col h-[60vh] max-h-[500px] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
           
           {/* Header */}
           <div className="bg-[#0F2557] px-4 py-3 flex justify-between items-center text-white shrink-0">
             <div className="flex gap-2 items-center">
               <ShieldCheck className="w-5 h-5" />
               <div>
                 <h4 className="font-bold text-sm">RegShield Assistant</h4>
                 <p className="text-[10px] text-slate-300">FCA Ruleset Mapped</p>
               </div>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setIsOpen(false)} className="hover:text-slate-300 transition p-1"><X className="w-4 h-4"/></button>
             </div>
           </div>

           {/* Messages Frame */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.map(m => (
               <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'bot' && <div className="w-6 h-6 rounded-full bg-[#1B4FD8] text-white flex items-center justify-center shrink-0 mr-2 mt-1"><ShieldCheck className="w-3 h-3"/></div>}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.sender === 'user' ? 'bg-[#1B4FD8] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                    <p dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    {m.relatedAction && (
                       <Link to={m.relatedAction.href} className="inline-block mt-3 bg-[#1B4FD8] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                         {m.relatedAction.label}
                       </Link>
                    )}
                  </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-[#1B4FD8] flex items-center justify-center shrink-0 mr-2 mt-1"><ShieldCheck className="w-3 h-3 text-white"/></div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
           </div>

           {/* Input Bounds */}
           <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-end shrink-0">
             <textarea 
               value={inputVal}
               onChange={e => setInputVal(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Assess a compliance rule..."
               className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-sm outline-none resize-none min-h-[40px] max-h-[80px]"
               rows={1}
             />
             <button disabled={!inputVal.trim()} onClick={() => handleSend(inputVal)} className="p-2 bg-[#1B4FD8] rounded-xl text-white disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition h-10 w-10 flex items-center justify-center shrink-0">
               <Send className="w-4 h-4 ml-0.5" />
             </button>
           </div>
        </div>
      )}
    </>
  );
};
