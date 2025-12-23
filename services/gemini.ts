
import { GoogleGenAI, Type } from "@google/genai";
import { DiscoveryAnswer, RoadmapStep, Language, DynamicQuestion, UnderstandingStep } from "../types";

// Helper for exponential backoff retries
async function callAiWithRetry<T>(task: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await task();
  } catch (error: any) {
    const isQuotaError = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    const isServerError = error?.message?.includes('500') || error?.message?.includes('503');

    if ((isQuotaError || isServerError) && retries > 0) {
      console.warn(`AI Service busy. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callAiWithRetry(task, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getNextDiscoveryStep = async (
  history: { role: 'user' | 'ai', content: string }[], 
  lang: Language
): Promise<UnderstandingStep> => {
  return callAiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an Elite Business Strategist. Your goal is to reach 100% understanding of the user's business.
      You must know EXACTLY:
      1. What they sell (Product/Service)
      2. Who they sell to (Target Audience)
      3. The primary problem they solve (Value Prop)
      
      Current Conversation History:
      ${history.map(h => `${h.role === 'user' ? 'CEO' : 'AI Strategist'}: ${h.content}`).join('\n')}
      
      Task:
      Analyze if you have a 100% clear picture of the business model. 
      - If YES: Provide a concise summary and set isUnderstood to true.
      - If NO: Ask a targeted follow-up question to clear up ambiguities.
      
      Format: JSON.
      Language: ${lang === 'vi' ? 'Vietnamese' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isUnderstood: { type: Type.BOOLEAN },
            nextQuestion: { type: Type.STRING },
            summary: { type: Type.STRING },
            understandingScore: { type: Type.NUMBER }
          },
          required: ["isUnderstood", "understandingScore"]
        }
      }
    });

    return JSON.parse(response.text);
  });
};

export const generateDiscoveryQuestions = async (businessSummary: string, lang: Language): Promise<DynamicQuestion[]> => {
  return callAiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an Elite Strategic Consultant. 
      Business Summary: ${businessSummary}.
      Task: Generate exactly 5 critical discovery questions tailored to this specific business to identify HR bottlenecks and profit growth opportunities using the 80/20 rule and GROW framework.
      
      Format: JSON.
      Language: ${lang === 'vi' ? 'Vietnamese' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  group: { type: Type.STRING },
                  text: { type: Type.STRING },
                  quickReplies: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "group", "text", "quickReplies"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.questions;
  });
};

export const generateRoadmap = async (answers: DiscoveryAnswer[], lang: Language): Promise<RoadmapStep[]> => {
  return callAiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a Strategic CHRO and Business Architect.
      Context: A CEO wants a 12-week roadmap for 1% daily profit growth.
      Framworks: 80/20 HR structure, 12-Week GROW.
      
      CEO interview answers:
      ${answers.map(a => `Q: ${a.questionText}\nA: ${a.answer}`).join('\n\n')}
      
      Output exactly 30 strategic steps in JSON format.
      Language: ${lang === 'vi' ? 'Vietnamese' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  stage: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  goal: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsible: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                  okr: { type: Type.STRING },
                  impactsProfit: { type: Type.BOOLEAN }
                },
                required: ["id", "stage", "title", "goal", "tasks", "responsible", "timeline", "okr", "impactsProfit"]
              }
            }
          },
          required: ["steps"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.steps.map((s: any) => ({ ...s, status: 'pending' }));
  });
};

export const askStrategicThinker = async (question: string, context: any, lang: Language): Promise<string> => {
  return callAiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: question,
      config: {
        systemInstruction: `You are an Elite CHRO Consultant. Solve business bottlenecks with 80/20 Rule, Power of One, 12-Week GROW. Language: ${lang === 'vi' ? 'Vietnamese' : 'English'}.`,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "No response.";
  });
};
