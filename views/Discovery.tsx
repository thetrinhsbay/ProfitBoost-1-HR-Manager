
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, DiscoveryAnswer, DynamicQuestion } from '../types';
import { generateDiscoveryQuestions, getNextDiscoveryStep } from '../services/gemini';
import { ArrowRight, ArrowLeft, Loader2, Sparkles, Building2, Bot, User, Send, CheckCircle2, AlertTriangle, RefreshCcw } from 'lucide-react';

interface DiscoveryProps {
  lang: Language;
  onComplete: (answers: DiscoveryAnswer[]) => void;
}

export const Discovery: React.FC<DiscoveryProps> = ({ lang, onComplete }) => {
  const [phase, setPhase] = useState<'understanding' | 'tailoring' | 'interview' | 'finalizing'>('understanding');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [understandingScore, setUnderstandingScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const initialMsg = lang === 'vi' 
      ? "Xin chào CEO. Để bắt đầu, vui lòng mô tả doanh nghiệp của bạn: Bạn bán sản phẩm/dịch vụ gì, cho ai, và giải quyết vấn đề then chốt nào?"
      : "Welcome CEO. To begin, please describe your business: What do you sell, to whom, and what core problem do you solve?";
    
    setChatHistory([{ role: 'ai', content: initialMsg }]);
  }, []);

  const handleSendUnderstanding = async () => {
    if (!userInput.trim() || loading) return;

    const newHistory = [...chatHistory, { role: 'user', content: userInput }];
    setChatHistory(newHistory);
    setUserInput('');
    setLoading(true);
    setError(null);

    try {
      const result = await getNextDiscoveryStep(newHistory, lang);
      setUnderstandingScore(result.understandingScore);
      
      if (result.isUnderstood) {
        setSummary(result.summary || '');
        setChatHistory(prev => [...prev, { role: 'ai', content: result.summary || 'Summary generated.' }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', content: result.nextQuestion || '...' }]);
      }
    } catch (err: any) {
      console.error(err);
      const isQuota = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
      setError(isQuota ? (lang === 'vi' ? 'Dịch vụ AI đang bận (Hết hạn mức). Thử lại sau giây lát.' : 'AI Service busy (Quota exhausted). Please retry shortly.') : 'API Error');
    } finally {
      setLoading(false);
    }
  };

  const startTailoring = async () => {
    setPhase('tailoring');
    setError(null);
    try {
      const questions = await generateDiscoveryQuestions(summary, lang);
      setDynamicQuestions(questions);
      setPhase('interview');
    } catch (err: any) {
      console.error(err);
      setPhase('understanding');
      setError(lang === 'vi' ? 'Không thể thiết kế bộ câu hỏi do quá tải. Thử lại?' : 'Failed to tailor questions due to load. Retry?');
    }
  };

  const handleReplyClick = (reply: string) => {
    const currentQuestion = dynamicQuestions[currentStep];
    setAnswers({ ...answers, [currentQuestion.id]: reply });
    setTimeout(handleNext, 300);
  };

  const handleNext = () => {
    if (currentStep < dynamicQuestions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      setPhase('finalizing');
      const formattedAnswers = dynamicQuestions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        answer: answers[q.id] || ''
      }));
      onComplete(formattedAnswers);
    }
  };

  if (phase === 'understanding') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 overflow-hidden">
        <div className="w-full max-w-5xl h-[85vh] neon-glow shadow-2xl p-1 relative z-10 flex flex-col">
          <div className="bg-white rounded-[0.9rem] flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <Building2 size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{t.deepUnderstanding}</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.aiAnalyzingModel}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.understandingProgress}</span>
                  <span className={`text-xl font-black ${understandingScore >= 100 ? 'text-green-600' : 'text-blue-600'}`}>{understandingScore}%</span>
                </div>
                <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${understandingScore >= 100 ? 'bg-green-500 animate-pulse' : 'bg-blue-600'}`} style={{ width: `${understandingScore}%` }} />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-slate-50/50">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-50 text-blue-600' : 'bg-slate-900 text-white shadow-lg'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`max-w-[70%] p-6 rounded-3xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white border border-slate-100' : 'bg-white border-2 border-slate-900 font-medium'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-4 animate-pulse">
                  <div className="p-3 rounded-xl bg-slate-900 text-white"><Bot size={20} /></div>
                  <div className="flex items-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm italic text-slate-400">
                    <Loader2 className="animate-spin" size={16} /> {lang === 'vi' ? 'AI đang phân tích sâu...' : 'AI is deep thinking...'}
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-4 p-6 bg-red-50 text-red-600 border border-red-100 rounded-3xl shadow-sm animate-fade-in">
                  <AlertTriangle size={20} />
                  <span className="text-sm font-bold flex-1">{error}</span>
                  <button onClick={handleSendUnderstanding} className="p-2 bg-white rounded-xl shadow-sm hover:bg-red-100 transition-colors">
                    <RefreshCcw size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="p-8 bg-white border-t border-slate-50">
              {understandingScore >= 100 ? (
                <button onClick={startTailoring} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl">
                  <CheckCircle2 size={20} className="text-green-400" /> {t.startStrategicDeepDive}
                </button>
              ) : (
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="flex-1 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900 transition-all text-sm font-medium"
                    placeholder={t.industryPlaceholder}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendUnderstanding()}
                    disabled={loading}
                  />
                  <button onClick={handleSendUnderstanding} disabled={!userInput.trim() || loading} className="p-6 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-all">
                    <Send size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'tailoring' || phase === 'finalizing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center max-w-md">
          {error ? (
            <div className="space-y-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900 uppercase">{error}</h2>
              <button onClick={() => setPhase('understanding')} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest flex items-center gap-3 mx-auto">
                <ArrowLeft size={20} /> {t.back}
              </button>
            </div>
          ) : (
            <>
              <div className="relative inline-block mb-8">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <Sparkles className="absolute -top-2 -right-2 text-yellow-500 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
                {phase === 'tailoring' ? t.tailoringInterview : (lang === 'vi' ? 'Đang Tính Toán Lộ Trình...' : 'AI Calculating Strategy...')}
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] opacity-60">
                AI is crunching 12 weeks of 80/20 growth steps based on your specific model.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  const question = dynamicQuestions[currentStep];
  const progress = ((currentStep + 1) / dynamicQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white overflow-hidden">
      <div className="w-full max-w-4xl neon-glow shadow-2xl p-1 relative z-10">
        <div className="bg-white rounded-[0.9rem] p-12 h-full flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Sparkles className="text-blue-600" size={24} />
              <span className="font-bold text-slate-800 uppercase tracking-widest text-sm">Strategic 80/20 Interview</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400">{currentStep + 1} / {dynamicQuestions.length}</span>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-10 max-w-2xl uppercase tracking-tighter">{question.text}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.quickReplies.map((reply, idx) => (
                <button key={idx} onClick={() => handleReplyClick(reply)} className={`p-6 text-left rounded-2xl border-2 transition-all duration-200 group flex items-center justify-between ${answers[question.id] === reply ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md scale-[1.02]' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50 text-slate-700'}`}>
                  <span className="font-bold text-lg">{reply}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${answers[question.id] === reply ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                    <ArrowRight size={18} />
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8">
              <textarea className="w-full p-4 border-b-2 border-slate-100 focus:border-blue-500 outline-none text-lg transition-all bg-transparent font-medium" placeholder={lang === 'vi' ? 'Hoặc nhập chi tiết khác...' : 'Or type detailed answer...'} value={answers[question.id] || ''} onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-between mt-12 items-center">
            <button onClick={() => setPhase('understanding')} className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-slate-800 font-black uppercase tracking-widest text-xs transition-all"><ArrowLeft size={16} /> {t.back}</button>
            <div className="flex items-center gap-4">
              {answers[question.id] && (
                <button onClick={handleNext} className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-black rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-xs">
                  {currentStep === dynamicQuestions.length - 1 ? t.complete : t.next} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
