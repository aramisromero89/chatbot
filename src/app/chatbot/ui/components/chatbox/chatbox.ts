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

import { ChatMessage } from '../../../model/chat-message';
import { ChatStore } from '../../state/chat.store';

@Component({
	selector: 'app-chatbox',
	templateUrl: './chatbox.html',
	styleUrls: ['./chatbox.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [ReactiveFormsModule, ComponentLibraryModule],
	providers: [ChatStore]
})
export class ChatboxComponent {
	private readonly chatStore = inject(ChatStore);
	private readonly messagesList = viewChild<ElementRef>('chatbox');

	readonly messages = computed<ChatMessage[]>(() => this.chatStore.chatMessageEntities());

	readonly messageControl = new FormControl('', {
		nonNullable: true,
		validators: [Validators.required, Validators.maxLength(2000)],
	});

	constructor() {
		effect(() => {
			const messageCount = this.messages().length;
			if (messageCount >= 0) {
				this.scrollToBottom();
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


		this.chatStore.sendMessage({ message: value });
		this.messageControl.setValue('');

	}
}
