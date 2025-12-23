
import React, { useState } from 'react';
import { Language, RoadmapStep, WeeklyPlan } from '../types';
import { TRANSLATIONS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Import PieChart as PieChartIcon to avoid conflict with recharts
import { TrendingUp, Users, Target, Zap, DollarSign, Activity, Percent, BarChart3, ShieldCheck, HeartPulse, PieChart as PieChartIcon } from 'lucide-react';

interface DashboardProps {
  lang: Language;
  roadmap: RoadmapStep[];
  weeklyPlans: WeeklyPlan[];
}

export const Dashboard: React.FC<DashboardProps> = ({ lang, roadmap, weeklyPlans }) => {
  const t = TRANSLATIONS[lang];
  const [leverage, setLeverage] = useState(1); // Default 1% impact simulator
  
  const profitData = Array.from({ length: 12 }, (_, i) => ({
    week: `Week ${i + 1}`,
    value: 100 * Math.pow(1.01 + (leverage * 0.001), i * 7),
  }));

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];
  const structureData = [
    { name: t.revenueCreators, value: 80 },
    { name: t.supportOps, value: 15 },
    { name: t.backOffice, value: 5 },
  ];

  const kpis = [
    { label: t.profitPerEmp, value: '$12,400', icon: DollarSign, color: 'blue' },
    { label: t.retentionRoi, value: '+18%', icon: HeartPulse, color: 'green' },
    { label: t.concentration8020, value: '82%', icon: Target, color: 'amber' },
    { label: t.executionRate, value: '94%', icon: Activity, color: 'purple' },
    { label: t.opexRatio, value: '12%', icon: Percent, color: 'red' },
    { label: t.strategicAlignment, value: 'High', icon: ShieldCheck, color: 'emerald' },
  ];

  return (
    <div className="space-y-8 pb-12 overflow-y-auto h-full no-scrollbar pr-4">
      {/* 10 Strategic KPIs (Condensed) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className={`w-8 h-8 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600 flex items-center justify-center mb-3`}>
              <kpi.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Power of One Simulator */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl neon-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Zap size={20} className="text-yellow-500 fill-yellow-500" />
                {t.power}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{t.impact1Percent}</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
              {[1, 2, 5].map(val => (
                <button 
                  key={val}
                  onClick={() => setLeverage(val)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${leverage === val ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-around text-center">
             <div>
               <p className="text-xs text-slate-400 font-bold uppercase">{t.baseProfit}</p>
               <p className="text-lg font-bold text-slate-800">$100k</p>
             </div>
             <div>
               <p className="text-xs text-slate-400 font-bold uppercase">{t.forecast12Week}</p>
               <p className="text-lg font-bold text-blue-600">${Math.round(profitData[11].value)}k</p>
             </div>
             <div>
               <p className="text-xs text-slate-400 font-bold uppercase">{t.dailyLift}</p>
               <p className="text-lg font-bold text-green-600">+$2.1k</p>
             </div>
          </div>
        </div>

        {/* 80/20 HR Structure Pie */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-purple-600" />
            {t.structure}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={structureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {structureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {structureData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
