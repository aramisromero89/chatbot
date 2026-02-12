import { Injectable, signal } from '@angular/core';

import { ChatMessage, ChatRole } from '../model/chat-message';

function createId(): string {
  const randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  if (randomUUID) {
    return randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: createId(),
    role,
    content,
    createdAtMs: Date.now(),
  };
}

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  private readonly _messages = signal<ChatMessage[]>([
    createMessage('assistant', 'Hi! Type a message to start the chat.'),
  ]);

  readonly messages = this._messages.asReadonly();

  addUserMessage(content: string): void {
    const trimmed = content.trim();
    if (!trimmed) return;

    this._messages.update((messages) => [...messages, createMessage('user', trimmed)]);
  }

  addAssistantMessage(content: string): void {
    const trimmed = content.trim();
    if (!trimmed) return;

    this._messages.update((messages) => [...messages, createMessage('assistant', trimmed)]);
  }
}
