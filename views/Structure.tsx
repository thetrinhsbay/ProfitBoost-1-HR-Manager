
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Users, Target, Activity, LayoutTemplate, Network, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StructureProps {
  lang: Language;
}

export const Structure: React.FC<StructureProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const data = [
    { name: t.revenueCreators, value: 20, color: '#2563eb', roles: ['Sales', 'Marketing', 'Product'] },
    { name: t.supportOps, value: 60, color: '#10b981', roles: ['Customer Success', 'Ops', 'Tech'] },
    { name: t.backOffice, value: 20, color: '#f59e0b', roles: ['Admin', 'HR', 'Finance'] },
  ];

  return (
    <div className="space-y-8 animate-fade-in no-scrollbar h-full pb-20 pr-4 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col items-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
            <LayoutTemplate className="text-blue-600" />
            {t.structure}
          </h2>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900">80/20</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.efficiency}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 w-full mt-8">
            {data.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</p>
                <p className="text-xl font-black text-slate-900">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 flex items-center gap-2">
            <Network className="text-purple-600" />
            {t.strategicMindmap}
          </h3>
          <div className="space-y-4">
            {data.map((group, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl hover:shadow-blue-100 transition-all border-l-8" style={{ borderLeftColor: group.color }}>
                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4">{group.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.roles.map((role, rIdx) => (
                    <div key={rIdx} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                      <ArrowRight size={12} className="text-slate-300" />
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200">
            <Target className="mb-4 opacity-50" size={32} />
            <h4 className="text-xl font-black mb-2 uppercase leading-none">{t.focusTop20}</h4>
            <p className="text-sm text-blue-100 mb-6">{t.aiDetectedSales}</p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-colors">
              {t.reallocateNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
