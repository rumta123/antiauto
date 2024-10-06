"use client"
import { useCreateMessage } from "@/entities/process/use-create-message";
import { useProcessById } from "@/entities/process/use-process";
import { useSessionQuery } from "@/entities/session";
import { ChatContextInfo } from "@/features/chat";
import { BackBtn } from "@/features/navigation";
import { MessageDto, ProcessesDecisionsDto } from "@/shared/api/generated";
import { UiButton, UiCard, UiInput, UiSpinner } from "@/shared/ui";
import { PaperPlane } from "@gravity-ui/icons";

import { Avatar } from "primereact/avatar";
import { Message } from "primereact/message";

import { useEffect, useRef, useState } from "react";

export function ChatDetailsWidget({ processId }: { processId: string }) {

    const { process, isLoading, isError, error } = useProcessById(processId)
    const { data: sessionData } = useSessionQuery();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { createMessage } = useCreateMessage(sendedMessage => {
        setMessage('');
    })

    useEffect(() => {
        scrollToBottom();
    }, [process?.messages])

    const scrollToBottom = () => {
        const scroll = messagesEndRef.current;
        if (scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    }

    const isPartOfGroup = (currentMessage: MessageDto, previousMessage?: MessageDto): boolean => {
        if (!previousMessage) return false;
        const currentMessageDate = new Date(currentMessage.createdAt);
        const previousMessageDate = new Date(previousMessage.createdAt);
        const diff = Math.abs(currentMessageDate.getTime() - previousMessageDate.getTime());
        return diff < 60000; // разница меньше 1 минуты
    };

    const handleSendMessage = () => {
        createMessage({
            process_id: processId,
            message: message,
            dealers_car_id: process?.dealers_car_id || '',
            lot_id: process?.lot_id || '',
            offer_id: process?.offer_id || '',
            process_type: process?.process_type || '',
        })
    }

    const handleDecisionPress = (decision: ProcessesDecisionsDto) => {
        createMessage({
            process_id: processId,
            message: '',
            dealers_car_id: process?.dealers_car_id || '',
            lot_id: process?.lot_id || '',
            offer_id: process?.offer_id || '',
            process_type: process?.process_type || '',
            decision_id: decision.id
        })
    }

    const chatName = process?.process_type === 'chat' && 'без темы' || process?.process_type === 'offer_moderation' && 'по предложению' || process?.process_type === 'dealer_registration' && 'по регистрации аккаунта дилера' || process?.process_type === 'feedback_moderation' && 'по обратной связи' || 'без темы';

    const messageTemplate = (message: MessageDto, index: number): JSX.Element => {
        const previousMessage = process?.messages[index + 1];
        const partOfGroup = isPartOfGroup(message, previousMessage);

        return (
            <div className="flex flex-col gap-2 my-2" key={message.id}>
                <div className={`flex flex-row items-end gap-2 ${message.author_id === sessionData?.id ? 'flex-row-reverse' : 'justify-start'}`}>
                    <Avatar label={message.author_name.slice(0, 1).toUpperCase()} shape="circle" />
                    <div className="flex flex-col gap-2">
                        {!partOfGroup && (
                            <p className="text-xxs font-semibold text-slate-400">{new Date(message.createdAt).toLocaleString()}</p>
                        )}
                        <div className="bg-seabrand-50 py-2 px-4 rounded-md">
                            <p className="text-xs font-semibold text-slate-700">{message.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7">
                <div className="flex flex-col gap-2">
                    <UiCard className="bg-white px-4 py-6 shadow-md">
                        <div className="flex flex-row items-center gap-2">
                            <BackBtn back />
                            <p className="text-lg font-semibold text-brand-900">Чат {chatName}</p>
                        </div>
                    </UiCard>
                    <div className="bg-white p-4 shadow-md min-h-[50vh] max-h-[60vh] overflow-y-auto" ref={messagesEndRef}>
                        <div className="flex flex-col-reverse gap-2">
                            {isLoading && <div className="flex flex-row justify-center items-center"><UiSpinner /></div>}
                            {isError && <div className="flex flex-row justify-center items-center"><Message severity="error" text={error?.message} /></div>}
                            {sessionData && process?.messages.map((message, index) => messageTemplate(message, index))}
                        </div>
                    </div>
                    <UiCard className="bg-white p-4 shadow-md flex flex-col gap-2">
                        { process?.is_decision_required && (sessionData?.type ==='service_desk' || sessionData?.type === 'root') && process?.decisions && process?.decisions.length > 0 &&
                            <div className="flex flex-row justify-end items-center gap-2">
                                {process.decisions.map((decision, index) => (
                                    <UiButton key={index} size="small" outlined severity="secondary" onClick={() => handleDecisionPress(decision)}>{decision.name}</UiButton>
                                ))}
                            </div>
                        }
                        <div className="flex flex-row items-center gap-2">
                            <UiInput placeholder={process?.is_process_closed ? "" : "Введите сообщение"} className="grow border-0 !shadow-none focus-within:!ring-0" value={message} onChange={(e) => setMessage(e.currentTarget.value)} disabled={process?.is_process_closed} />
                            <UiButton onClick={handleSendMessage} disabled={process?.is_process_closed}><PaperPlane /></UiButton>
                        </div>
                    </UiCard>
                </div>
            </div>

            <div className="col-span-5">
                <ChatContextInfo offer_id={process?.offer_id} lot_id={process?.lot_id} dealers_car_id={process?.dealers_car_id} user_id={sessionData?.id} />
            </div>
        </div>
    )
}

