import { Injectable, signal } from '@angular/core';

import { ChatMessage, ChatRole } from '../model/chat-message';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ChatBoxResponse {
  response: string
}


@Injectable({ providedIn: 'root' })
export class ChatApiService {
  sendMessage(content: string): Observable<ChatBoxResponse> {
    return of({ response: `Response to '${content}'` }).pipe(
      delay(1000)
    );
  }
}
