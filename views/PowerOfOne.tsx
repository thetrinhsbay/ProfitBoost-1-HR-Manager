
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Zap, TrendingUp, DollarSign, ArrowUpRight, Percent } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PowerOfOneProps {
  lang: Language;
}

export const PowerOfOne: React.FC<PowerOfOneProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [leverage, setLeverage] = useState(1);
  const [baseProfit, setBaseProfit] = useState(100000);

  const data = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    profit: baseProfit * Math.pow(1 + (leverage / 100), i)
  }));

  const levers = [
    { name: lang === 'vi' ? 'Giá bán' : 'Price', icon: DollarSign, impact: t.impactHigh },
    { name: lang === 'vi' ? 'Năng suất' : 'Productivity', icon: Zap, impact: t.impactMedium },
    { name: lang === 'vi' ? 'Chi phí' : 'OpEx', icon: Percent, impact: t.impactHigh },
    { name: lang === 'vi' ? 'Quy mô' : 'Volume', icon: TrendingUp, impact: t.impactMedium },
  ];

  return (
    <div className="space-y-8 animate-fade-in no-scrollbar h-full pb-20 pr-4 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl neon-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500" />
                {t.power} Simulation
              </h2>
              <p className="text-sm text-slate-500 mt-1">Adjust the daily/weekly leverage to see the Power of One.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-blue-600">+{leverage}%</span>
              <input 
                type="range" 
                min="0.1" 
                max="10" 
                step="0.1" 
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value))}
                className="w-32 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" hide />
                <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']}
                />
                <Area type="monotone" dataKey="profit" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.baseProfit}</p>
              <p className="text-xl font-black text-slate-900">${baseProfit.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.forecast12Week}</p>
              <p className="text-xl font-black text-blue-600">${Math.round(data[11].profit).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl">
              <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Growth Lift</p>
              <p className="text-xl font-black text-green-600">+{Math.round(((data[11].profit - baseProfit) / baseProfit) * 100)}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-6">Strategic Levers</h3>
            <div className="space-y-4">
              {levers.map((lever, idx) => (
                <div key={idx} className="group p-4 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-blue-600">
                        <lever.icon size={18} />
                      </div>
                      <span className="font-bold text-slate-700">{lever.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">
                      {lever.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">{t.strategicAdvice}</p>
              <h4 className="text-lg font-black mb-4 leading-tight">{t.focusHrProductivity}</h4>
              <button className="w-full py-3 bg-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                {t.applyActionPlan} <ArrowUpRight size={14} />
              </button>
            </div>
            <Zap className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32" />
          </div>
        </div>
      </div>
    </div>
  );
};
