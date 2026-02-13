import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Injector,
  afterRenderEffect,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentLibraryModule } from '@camos/cds-angular';

import { ChatMessage, ChatMessageState } from '../../../model/chat-message';
import { ChatStore } from '../../state/chat.store';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.html',
  styleUrls: ['./chatbox.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, ComponentLibraryModule],
  providers: [ChatStore],
})
export class ChatboxComponent {
  private readonly chatStore = inject(ChatStore);
  private readonly injector = inject(Injector);
  private readonly messagesList = viewChild<ElementRef>('chatbox');
  private readonly messageInput = viewChild<ElementRef<HTMLTextAreaElement>>('messageInput');

  readonly messages = computed<ChatMessage[]>(() => this.chatStore.chatMessageEntities());

  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(2000)],
  });

  constructor() {
    afterRenderEffect(
      {
        mixedReadWrite: () => {
          const messageCount = this.messages().length;
          if (messageCount < 1) return;
          this.scrollToBottom();
        },
      },
      { injector: this.injector },
    );
  }

  private scrollToBottom(): void {
    const list = this.messagesList()?.nativeElement;
    if (!list) return;

    list.scrollTop = list.scrollHeight;
  }

  autoResize(): void {
    const textarea = this.messageInput()?.nativeElement;
    if (!textarea) return;

    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set to content height
    if (textarea.scrollHeight > 400) {
      textarea.style.overflowY = 'scroll';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }

  iconByState(state: ChatMessageState): string {
    switch (state) {
      case 'success':
        return 'cds_success';
      case 'sending':
        return 'cds_check';
      default:
        return 'cds_warning';
    }
  }

  send(): void {
    const value = this.messageControl.value.trim();
    if (!value) {
      this.messageControl.markAsTouched();
      return;
    }

    this.chatStore.sendMessage({ message: value });
    this.messageControl.setValue('');
    this.autoResize();
  }
}
