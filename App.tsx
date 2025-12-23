
import React, { useState } from 'react';
import { Auth } from './views/Auth';
import { Discovery } from './views/Discovery';
import { Dashboard } from './views/Dashboard';
import { Roadmap } from './views/Roadmap';
import { Commitment } from './views/Commitment';
import { AiThinker } from './views/AiThinker';
import { PowerOfOne } from './views/PowerOfOne';
import { Grow } from './views/Grow';
import { Structure } from './views/Structure';
import { Reports } from './views/Reports';
import { Layout } from './components/Layout';
import { User, Role, Language, DiscoveryAnswer, RoadmapStep, WeeklyPlan } from './types';
import { generateRoadmap } from './services/gemini';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setView] = useState<string>('dashboard');
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (email: string, role: Role, lang: Language) => {
    setUser({
      id: '1',
      email,
      role,
      lang,
      hasCompletedDiscovery: false,
      hasSignedCommitment: false
    });
  };

  const handleSwitchLang = (lang: Language) => {
    setUser(curr => curr ? { ...curr, lang } : null);
  };

  const handleDiscoveryComplete = async (discoveryAnswers: DiscoveryAnswer[]) => {
    if (!user) return;
    setLoading(true);
    setAnswers(discoveryAnswers);
    try {
      const generatedRoadmap = await generateRoadmap(discoveryAnswers, user.lang);
      setRoadmap(generatedRoadmap);
      
      const plans: WeeklyPlan[] = Array.from({ length: 12 }, (_, i) => ({
        week: i + 1,
        focus: `Phase Focus ${Math.floor(i / 2.5) + 1}`,
        steps: generatedRoadmap.slice(i * 2, (i + 1) * 2).map(s => s.id),
        kpis: [`KPI ${i + 1}.1`, `Profit Check ${i + 1}`],
        progress: 0
      }));
      setWeeklyPlans(plans);
      setUser(curr => curr ? { ...curr, hasCompletedDiscovery: true } : null);
    } catch (error) {
      console.error(error);
      alert("AI Service Timeout. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommitmentSigned = () => {
    setUser(curr => curr ? { ...curr, hasSignedCommitment: true } : null);
    setView('dashboard');
  };

  if (!user) return <Auth onLogin={handleLogin} />;
  if (!user.hasCompletedDiscovery) return <Discovery lang={user.lang} onComplete={handleDiscoveryComplete} />;
  if (!user.hasSignedCommitment) return <Commitment lang={user.lang} onSign={handleCommitmentSigned} />;

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      setView={setView} 
      lang={user.lang}
      onLogout={() => setUser(null)}
      onSwitchLang={handleSwitchLang}
    >
      <div className="h-full">
        {currentView === 'dashboard' && <Dashboard lang={user.lang} roadmap={roadmap} weeklyPlans={weeklyPlans} />}
        {currentView === 'roadmap' && <Roadmap lang={user.lang} steps={roadmap} />}
        {currentView === 'grow' && <Grow lang={user.lang} steps={roadmap} />}
        {currentView === 'structure' && <Structure lang={user.lang} />}
        {currentView === 'power' && <PowerOfOne lang={user.lang} />}
        {currentView === 'aiThinker' && <AiThinker lang={user.lang} context={{ roadmap, answers }} />}
        {currentView === 'reports' && <Reports lang={user.lang} />}
        {currentView === 'commitment' && <Commitment lang={user.lang} onSign={handleCommitmentSigned} />}
        
        {/* Placeholder for other views */}
        {['coaching'].includes(currentView) && (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <Sparkles size={48} className="mb-4 animate-pulse" />
            <p className="font-bold uppercase tracking-[0.3em] text-xs">AI Module Initializing...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
