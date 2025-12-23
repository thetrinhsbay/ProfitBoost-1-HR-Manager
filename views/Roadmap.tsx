
import React from 'react';
import { Language, RoadmapStep } from '../types';
import { TRANSLATIONS } from '../constants';
import { Clock, User, Target, ChevronRight, CheckCircle2 } from 'lucide-react';

interface RoadmapProps {
  lang: Language;
  steps: RoadmapStep[];
}

export const Roadmap: React.FC<RoadmapProps> = ({ lang, steps }) => {
  const t = TRANSLATIONS[lang];
  const phases = t.phases;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 no-scrollbar overflow-y-auto h-full">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900">{t.roadmap}</h1>
        <p className="text-slate-500 mt-2">{t.roadmapDesc}</p>
      </div>

      {phases.map((phaseTitle, index) => {
        const stageId = index + 1;
        return (
          <section key={stageId} className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {stageId}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{phaseTitle}</h2>
            </div>

            <div className="grid gap-6 pl-14">
              {steps.filter(s => s.stage === stageId).map((step) => (
                <div key={step.id} className="bg-white p-6 rounded-2xl border shadow-sm group hover:border-blue-400 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Step {step.id}: {step.title}
                        {step.status === 'completed' && <CheckCircle2 size={18} className="text-green-500" />}
                      </h3>
                      <p className="text-slate-600 mt-1">{step.goal}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      step.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {step.status === 'completed' ? t.done : t.pending}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase">{t.keyTasks}</p>
                      <ul className="space-y-2">
                        {step.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <ChevronRight size={14} className="mt-1 text-blue-400" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                          <User size={16} />
                          <span className="font-medium">{step.responsible}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={16} />
                          <span className="font-medium">{step.timeline}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
                          <Target size={12} /> {t.okrKpi}
                        </p>
                        <p className="text-sm font-semibold text-blue-900">{step.okr}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
