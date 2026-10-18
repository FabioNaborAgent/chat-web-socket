import { useListMessageChat } from "@/hooks/chat-hook";
import { CardDefault } from "./card-default";
import { useEffect, useState  } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useWebSocket } from "@/providers/websocket-provider";
import { MessageList } from "./message-list";
import { MessageForm } from "./message-form";

export function Message({chat_id}:{chat_id:string}) {

    const { lastEvent } = useWebSocket();

    const [messages, setMessages] = useState<ChatMessageResponse[]>([])

    const useListMessage = useListMessageChat()

    useEffect(() => {
        if (lastEvent?.event == "new-message") {
            if (String(lastEvent.data.chat_id) == chat_id) {
                setMessages((previousMessages) => {
                    const newMessage = lastEvent.data as ChatMessageResponse;
                    if (previousMessages.some((message) => message.id === newMessage.id)) {
                        return previousMessages;
                    }
                    return [...previousMessages, newMessage];
                });
            }
            return;
        };
    }, [lastEvent, chat_id])

    useEffect(() => {
        useListMessage.mutate({
            chat_id:chat_id
        }, {
            onSuccess: (response) => {
                setMessages(response);
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    const apiError = error as AxiosError<ApiError>;

                    toast.error(
                        apiError.response?.data?.detail ??
                        "Erro ao carregar mensagens."
                    );
                } else {
                    toast.error("Erro inesperado.");
                }
            }
        })
    }, [])


    return (
        <CardDefault title={`Chat [${chat_id}]`} description="Bate-Papo">

            <MessageList messages={messages} />

            <MessageForm chat_id={chat_id} />

        </CardDefault>
    )
}