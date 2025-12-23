
import React from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LogOut, LayoutDashboard, TrendingUp, Brain, Target, BarChart3, FileText, Settings2, HelpCircle, Users, Download, Globe } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  currentView: string;
  setView: (view: string) => void;
  lang: Language;
  onLogout: () => void;
  onSwitchLang: (lang: Language) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, currentView, setView, lang, onLogout, onSwitchLang }) => {
  const t = TRANSLATIONS[lang];

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, num: "01" },
    { id: 'structure', label: t.structure, icon: BarChart3, num: "02" },
    { id: 'grow', label: t.grow, icon: TrendingUp, num: "03" },
    { id: 'power', label: t.power, icon: Brain, num: "04" },
    { id: 'roadmap', label: t.roadmap, icon: Target, num: "05" },
    { id: 'knowledge', label: t.knowledge, icon: HelpCircle, num: "06" },
    { id: 'affiliate', label: t.affiliate, icon: Users, num: "07" },
    { id: 'reports', label: t.pdf, icon: Download, num: "08" },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-50 border-r border-slate-100 hidden lg:flex flex-col shadow-xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-6 neon-glow">
              <TrendingUp size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                AI <span className="text-blue-600">Director</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic SaaS v3.0</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  currentView === item.id 
                  ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md'
                }`}
              >
                <span className="text-[10px] font-black opacity-30 group-hover:opacity-100">{item.num}</span>
                <item.icon size={20} className={currentView === item.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-600'} />
                <span className="text-xs font-black uppercase tracking-widest flex-1 text-left">{item.label}</span>
                {currentView === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate uppercase">{user?.email?.split('@')[0]}</p>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Active Partner</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-4 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl hover:border-red-200 transition-all"
          >
            <LogOut size={16} />
            {t.terminate}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-12 sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {menuItems.find(i => i.id === currentView)?.label || 'Overview'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.aiEngineResolved}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm neon-glow overflow-hidden">
              <button 
                onClick={() => onSwitchLang('vi')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'vi' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                VN
              </button>
              <button 
                onClick={() => onSwitchLang('en')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                EN
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
               <Settings2 size={18} className="text-slate-400" />
               <div className="w-px h-5 bg-slate-200"></div>
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t.activePhase}</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-12 no-scrollbar overflow-hidden">
          <div className="view-transition h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
