import { patchState, signalStore, type, withMethods } from "@ngrx/signals";
import { addEntity, entityConfig, updateEntity, withEntities } from "@ngrx/signals/entities";
import { ChatMessage } from "../../model/chat-message";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { ChatApiService } from "../../services/chat-store.service";
import { inject } from "@angular/core";
import { pipe } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { tapResponse } from "@ngrx/operators";

const chatEntityConfig = entityConfig({
    entity: type<ChatMessage>(),
    collection: 'chatMessage',
});


export const ChatStore = signalStore(
    withEntities(chatEntityConfig),
    withMethods((store, api = inject(ChatApiService)
    ) => ({
        sendMessage: rxMethod<{ message: string }>(pipe(
            mergeMap((params) => {
                const message: ChatMessage = {
                    id: crypto.randomUUID(),
                    role: 'user',
                    content: params.message,
                    state: 'sending',
                    createdAt: Date.now()
                };
                patchState(store, addEntity(message, chatEntityConfig));
                return api.sendMessage(params.message).pipe(
                    tapResponse({
                        next: (data) => {
                            patchState(store, updateEntity({ id: message.id, changes: { state: 'success' } }, chatEntityConfig));
                            const responseMessage: ChatMessage = {
                                id: crypto.randomUUID(),
                                role: 'assistant',
                                content: data.response,
                                state: 'success',
                                createdAt: Date.now()
                            };
                            patchState(store, addEntity(responseMessage, chatEntityConfig));
                        },
                        error: (error) => {
                            patchState(store, updateEntity({ id: message.id, changes: { state: 'error' } }, chatEntityConfig));
                        }
                    })
                );
            })
        ))

    }))
)