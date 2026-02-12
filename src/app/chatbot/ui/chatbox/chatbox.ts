import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	afterNextRender,
	computed,
	effect,
	ElementRef,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentLibraryModule } from '@camos/cds-angular';

import { ChatMessage } from '../../model/chat-message';
import { ChatStoreService } from '../../services/chat-store.service';

@Component({
	selector: 'app-chatbox',
	templateUrl: './chatbox.html',
	styleUrls: ['./chatbox.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [ReactiveFormsModule, ComponentLibraryModule],
})
export class ChatboxComponent {
	private readonly chatStore = inject(ChatStoreService);
	private readonly messagesList = viewChild<ElementRef<HTMLOListElement>>('messagesList');

	readonly messages = computed<ChatMessage[]>(() => this.chatStore.messages());

	readonly messageControl = new FormControl('', {
		nonNullable: true,
		validators: [Validators.required, Validators.maxLength(2000)],
	});

	readonly isSending = signal(false);

	constructor() {
		effect(() => {
			const messageCount = this.messages().length;
			if (messageCount >= 0) {
				afterNextRender(() => this.scrollToBottom());
			}
		});
	}

	private scrollToBottom(): void {
		const list = this.messagesList()?.nativeElement;
		if (!list) return;

		list.scrollTop = list.scrollHeight;
	}

	send(): void {
		const value = this.messageControl.value.trim();
		if (!value) {
			this.messageControl.markAsTouched();
			return;
		}

		this.isSending.set(true);
		try {
			this.chatStore.addUserMessage(value);
			this.messageControl.setValue('');
		} finally {
			this.isSending.set(false);
		}
	}
}
