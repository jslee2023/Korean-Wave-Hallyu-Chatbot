export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

export type MessageRole = 'user' | 'bot';