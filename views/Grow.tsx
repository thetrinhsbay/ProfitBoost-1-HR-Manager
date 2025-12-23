
import React from 'react';
import { Language, RoadmapStep } from '../types';
import { TRANSLATIONS } from '../constants';
import { Target, Search, Lightbulb, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

interface GrowProps { lang: Language; steps: RoadmapStep[]; }

export const Grow: React.FC<GrowProps> = ({ lang, steps }) => {
  const t = TRANSLATIONS[lang];
  const growPhases = [
    { id: 'G', label: t.growPhases.G.label, icon: Target, color: 'blue', desc: t.growPhases.G.desc },
    { id: 'R', label: t.growPhases.R.label, icon: Search, color: 'amber', desc: t.growPhases.R.desc },
    { id: 'O', label: t.growPhases.O.label, icon: Lightbulb, color: 'emerald', desc: t.growPhases.O.desc },
    { id: 'W', label: t.growPhases.W.label, icon: Zap, color: 'purple', desc: t.growPhases.W.desc },
  ];

  return (
    <div className="space-y-12 animate-fade-in no-scrollbar h-full pb-20 pr-4 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {growPhases.map((phase) => (
          <div key={phase.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex flex-col items-center text-center group hover:scale-105 transition-transform cursor-pointer">
            <div className={`w-16 h-16 rounded-2xl bg-${phase.color}-50 text-${phase.color}-600 flex items-center justify-center mb-4 shadow-inner`}>
              <phase.icon size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{phase.id} - {phase.label}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{phase.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative neon-border">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
            <CheckCircle2 />
          </div>
          12-Week GROW Roadmap
        </h2>

        <div className="space-y-10 relative">
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10"></div>
          
          {steps.slice(0, 10).map((step, idx) => (
            <div key={idx} className="flex gap-10 group">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                  step.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-2 border-slate-100 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-600'
                }`}>
                  {idx + 1}
                </div>
              </div>
              
              <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-transparent group-hover:border-blue-100 group-hover:bg-white transition-all shadow-sm group-hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.goal}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    step.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {step.status === 'completed' ? t.done : t.pending}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Target size={14} className="text-blue-400" />
                    KPI: <span className="text-slate-700">{step.okr}</span>
                  </div>
                  <button className="ml-auto flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                    Execution Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
