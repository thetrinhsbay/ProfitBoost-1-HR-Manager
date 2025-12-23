
import React, { useState } from 'react';
import { TRANSLATIONS, AI_SUGGESTIONS } from '../constants';
import { Language } from '../types';
import { askStrategicThinker } from '../services/gemini';
import { Brain, Send, Loader2, Sparkles, User, Bot, Lightbulb, Zap, ShieldAlert } from 'lucide-react';

interface AiThinkerProps {
  lang: Language;
  context: any;
}

export const AiThinker: React.FC<AiThinkerProps> = ({ lang, context }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const t = TRANSLATIONS[lang];
  const suggestions = AI_SUGGESTIONS[lang];

  const handleAsk = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim() || loading) return;

    const userMsg = messageToSend;
    if (!text) setInput('');
    
    setChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await askStrategicThinker(userMsg, context, lang);
      setChat(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      console.error(error);
      setChat(prev => [...prev, { role: 'ai', content: t.reports + " ERROR" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-6 mb-10 p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden neon-glow">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center relative z-10 shadow-lg shadow-blue-500/50 animate-pulse">
          <Brain size={36} />
        </div>
        <div className="relative z-10 flex-1">
          {/* Fix: Property 'aiThinker' does not exist on type of TRANSLATIONS, changed to 'thinker' */}
          <h1 className="text-3xl font-black uppercase tracking-tighter">{t.thinker}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Deep Thinking Model Resolved</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}}></div>)}
            </div>
          </div>
        </div>
        <Zap className="absolute right-10 top-1/2 -translate-y-1/2 text-white/5 w-40 h-40 rotate-12" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 p-8 mb-8 border border-slate-100 rounded-[3rem] bg-slate-50/50 shadow-inner no-scrollbar">
        {chat.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-10 p-12">
            <div className="flex flex-col items-center space-y-6">
               <div className="p-8 bg-white rounded-full shadow-xl">
                 <Sparkles size={64} className="text-blue-500" />
               </div>
               <p className="text-center font-black uppercase tracking-[0.3em] text-xs max-w-sm leading-relaxed">{t.thinkerPrompt}</p>
            </div>
            
            <div className="w-full max-w-2xl bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                <Lightbulb size={20} className="text-yellow-500" />
                {t.suggestions}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(suggestion)}
                    className="text-left text-xs bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 px-6 py-4 rounded-2xl transition-all font-bold group"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {chat.map((msg, i) => (
          <div key={i} className={`flex items-start gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-4 rounded-3xl shadow-2xl ${msg.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white'}`}>
              {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
            </div>
            <div className={`max-w-[80%] p-8 rounded-[3rem] shadow-2xl text-base leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-white border border-slate-100 text-slate-800' : 'bg-white border-blue-600 border-4 text-slate-900 neon-glow'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-6">
            <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-2xl">
              <Bot size={24} />
            </div>
            <div className="flex items-center gap-6 p-10 bg-blue-600 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
              <Loader2 className="animate-spin text-white" size={32} />
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-[0.5em]">{t.thinkerAction}</span>
                <span className="text-[10px] opacity-70 font-black mt-2 uppercase tracking-widest">Analyzing 80/20 Framework & Power of One impact...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-1 neon-glow rounded-[3rem] shadow-2xl">
        <div className="bg-white rounded-[2.8rem] p-3 flex items-center">
          <textarea
            className="flex-1 p-6 border-none focus:ring-0 outline-none text-xl font-medium transition-all resize-none bg-transparent h-24 no-scrollbar"
            placeholder={t.thinkerPrompt}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <button
            onClick={() => handleAsk()}
            disabled={!input.trim() || loading}
            className="p-6 bg-slate-900 text-white rounded-[2.5rem] hover:bg-blue-600 disabled:opacity-50 shadow-2xl transition-all active:scale-90 m-2 flex items-center justify-center"
          >
            <Send size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};
