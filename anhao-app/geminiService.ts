
import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

export class GeminiService {
  private modelName = 'gemini-3-flash-preview';

  private getClient() {
    // 这里的 API_KEY 会被 vite.config.ts 中的 define 替换为真实的值
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey });
  }

  async chat(history: Message[], userInput: string) {
    const ai = this.getClient();
    const chat = ai.chats.create({
      model: this.modelName,
      config: {
        systemInstruction: `你叫“安好”，是一个温暖、睿智且充满共情心的私人生活伴侣。
        你的任务是倾听用户的日常琐事，提供情绪支持、健康建议和积极的正念引导。
        语气应保持优雅、亲切、克制，像一位多年未见的老友。
        始终使用中文回答。不要使用过于死板的 AI 腔调，要像真人在交谈。`,
      },
    });
    
    return chat.sendMessageStream({ message: userInput });
  }

  async generateSummary(messages: Message[]): Promise<string> {
    if (messages.length < 2) return "";
    try {
      const ai = this.getClient();
      const textHistory = messages.map(m => `${m.role === Role.USER ? '用户' : '安好'}: ${m.content}`).join('\n');
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: `请将这段对话提取出一个温馨的“生活瞬间”标题（10字以内）：\n\n${textHistory}`,
      });
      return response.text?.trim() || "温情时刻";
    } catch (e) {
      return "温情时刻";
    }
  }
}

export const gemini = new GeminiService();
