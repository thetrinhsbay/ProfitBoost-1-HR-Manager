
export type Role = 'CEO' | 'HR_DIRECTOR' | 'MANAGER';
export type Language = 'vi' | 'en';

export interface User {
  id: string;
  email: string;
  role: Role;
  lang: Language;
  hasCompletedDiscovery: boolean;
  hasSignedCommitment: boolean;
  businessField?: string;
  businessSummary?: string;
}

export interface DynamicQuestion {
  id: number;
  group: string;
  text: string;
  quickReplies: string[];
}

export interface DiscoveryAnswer {
  questionId: number;
  questionText: string;
  answer: string;
}

export interface UnderstandingStep {
  isUnderstood: boolean;
  nextQuestion?: string;
  summary?: string;
  understandingScore: number; // 0-100
}

export interface RoadmapStep {
  id: number;
  stage: number;
  title: string;
  goal: string;
  tasks: string[];
  responsible: string;
  timeline: string;
  okr: string;
  status: 'pending' | 'in_progress' | 'completed';
  impactsProfit: boolean;
}

export interface WeeklyPlan {
  week: number;
  focus: string;
  steps: number[]; // IDs of RoadmapSteps
  kpis: string[];
  progress: number;
}
