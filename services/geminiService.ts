
import { GoogleGenAI } from "@google/genai";
import { Order, Item } from "../types";

// Always use process.env.API_KEY directly as per SDK requirements.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartInsights = async (orders: Order[], items: Item[]): Promise<string> => {
  const prompt = `
    As an AI Restaurant Consultant, analyze this recent sales data:
    - Total Orders: ${orders.length}
    - Revenue: ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
    - Items available: ${items.map(i => `${i.name} ($${i.price})`).join(', ')}
    
    Provide 3 concise, actionable business insights to increase revenue or optimize operations. 
    Format as a bulleted list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Accessing the text property directly without calling it as a function.
    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to fetch AI insights. Check your connection.";
  }
};
