
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { ShieldCheck, Calendar, Zap, ClipboardCheck, PenTool } from 'lucide-react';

interface CommitmentProps {
  lang: Language;
  onSign: () => void;
}

export const Commitment: React.FC<CommitmentProps> = ({ lang, onSign }) => {
  const [signed, setSigned] = useState(false);
  const [signature, setSignature] = useState('');
  const t = TRANSLATIONS[lang];
  
  const clauses = [
    { icon: Calendar, title: t.timeCommitment, text: t.timeCommitmentDesc },
    { icon: Zap, title: t.actionCommitment, text: t.actionCommitmentDesc },
    { icon: ClipboardCheck, title: t.reportingDiscipline, text: t.reportingDisciplineDesc },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 no-scrollbar overflow-y-auto h-full">
      <div className="bg-white rounded-3xl border shadow-xl overflow-hidden">
        <div className="p-10 bg-slate-900 text-white text-center">
          <ShieldCheck size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-2xl font-bold">{t.charterTitle}</h1>
          <p className="text-slate-400 mt-2">{t.charterSubtitle}</p>
        </div>

        <div className="p-10 space-y-8">
          <p className="text-slate-600 leading-relaxed italic text-center">
            "{t.disciplineQuote}"
          </p>

          <div className="space-y-6">
            {clauses.map((clause, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <clause.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{clause.title}</h3>
                  <p className="text-sm text-slate-500">{clause.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t">
            <label className="text-sm font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              {t.signPrompt}
            </label>
            <div className="relative">
              <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text"
                placeholder={t.signaturePlaceholder}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-xl bg-slate-50 focus:border-blue-500 outline-none text-xl font-serif"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (signature) {
                setSigned(true);
                onSign();
              }
            }}
            disabled={!signature}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-200"
          >
            {t.signAndBegin}
          </button>
        </div>
      </div>
    </div>
  );
};
