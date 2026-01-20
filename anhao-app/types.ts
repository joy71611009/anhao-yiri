
export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  LIVE = 'LIVE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}
