
import React, { useState } from 'react';
import { Role, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { TrendingUp, Mail, User, Globe, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, role: Role, lang: Language) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('CEO');
  const [lang, setLang] = useState<Language>('vi');
  
  const t = TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email, role, lang);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="w-full max-w-xl neon-glow shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-1">
        <div className="bg-white rounded-[0.9rem] p-12 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-900 text-white rounded-[2rem] shadow-2xl mb-8 rotate-3 neon-glow">
              <TrendingUp size={48} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              AI <span className="text-blue-600">Director</span>
            </h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">{t.authSlogan}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center p-1 bg-slate-50 rounded-2xl border border-slate-100">
              {(['vi', 'en'] as Language[]).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${lang === l ? 'bg-white shadow-xl text-blue-600 scale-[1.05]' : 'text-slate-400'}`}
                >
                  <Globe size={14} />
                  {l === 'vi' ? 'Tiếng Việt' : 'English'}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email Access</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  type="email"
                  required
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none text-lg font-medium transition-all focus:bg-white"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Command Role</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <select
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none appearance-none text-lg font-medium transition-all focus:bg-white"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="CEO">CEO / Founder</option>
                  <option value="HR_DIRECTOR">HR Director</option>
                  <option value="MANAGER">Strategic Manager</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-6 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl hover:bg-blue-600 hover:scale-[1.02] active:scale-95 relative group overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                <Sparkles size={18} className="text-yellow-400" />
                {t.login}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
