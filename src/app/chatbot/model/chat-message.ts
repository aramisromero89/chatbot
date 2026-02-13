export type ChatRole = 'user' | 'assistant';
export type ChatMessageState = 'sending' | 'success' | 'error';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  state: ChatMessageState,
  createdAt: number;
}
