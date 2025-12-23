
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { FileText, Download, Share2, Sparkles, PieChart, TrendingUp, Users } from 'lucide-react';

interface ReportsProps {
  lang: Language;
}

export const Reports: React.FC<ReportsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const reports = [
    { title: lang === 'vi' ? 'Tổng quan chiến lược hàng tuần' : 'Weekly Strategic Overview', date: 'Oct 24, 2024', type: lang === 'vi' ? 'Kiểm toán đầy đủ' : 'Full Audit', icon: FileText, color: 'blue' },
    { title: lang === 'vi' ? 'Phân tích cấu trúc nhân sự 80/20' : '80/20 HR Structural Analysis', date: 'Oct 20, 2024', type: lang === 'vi' ? 'Sơ đồ tổ chức' : 'Org Map', icon: PieChart, color: 'purple' },
    { title: lang === 'vi' ? 'Dự báo tăng trưởng Power of One' : 'Power of One Growth Forecast', date: 'Oct 15, 2024', type: lang === 'vi' ? 'Dự báo' : 'Forecast', icon: TrendingUp, color: 'green' },
    { title: lang === 'vi' ? 'Báo cáo ROI tài năng & Giữ chân' : 'Talent ROI & Retention Report', date: 'Oct 10, 2024', type: lang === 'vi' ? 'Phân tích con người' : 'People Analytics', icon: Users, color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-fade-in no-scrollbar h-full pb-20 pr-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t.reports}</h2>
          <p className="text-sm text-slate-500 mt-1">{t.exportDocDesc}</p>
        </div>
        <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          <Sparkles size={16} className="text-yellow-400" />
          {t.generateNewAudit}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden neon-border">
            <div className="flex items-start justify-between relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-${report.color}-50 text-${report.color}-600 flex items-center justify-center mb-6`}>
                <report.icon size={28} />
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                  <Share2 size={16} />
                </button>
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-green-600 rounded-lg transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{report.type}</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 uppercase tracking-tight">{report.title}</h3>
              <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Generated on {report.date}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50 p-12 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-slate-300 mb-6">
          <FileText size={40} />
        </div>
        <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.customBoardReport}</h4>
        <p className="text-sm text-slate-500 max-w-sm mt-2 mb-8 italic">{t.customReportDesc}</p>
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] hover:text-blue-700 transition-colors">
          {t.openStrategyLab}
        </button>
      </div>
    </div>
  );
};
