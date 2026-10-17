'use client'
import { useListChat } from "@/hooks/chat-hook";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CardDefault } from "./card-default";
import { ChatItem } from "./chat-item";
import { useWebSocket } from "@/providers/websocket-provider";

export function ChatList() {
    const listChat = useListChat()

    const { lastEvent, status } = useWebSocket();

    const [chats, setChats] = useState<ChatListResponse[]>([])

    useEffect(() => {
        if (lastEvent?.event == "new-chat"){
            const newChat = lastEvent.data as ChatListResponse;
    
            setChats((previousChats) => {
                if (previousChats.some((chat) => chat.id === newChat.id)) {
                    return previousChats;
                }
                return [newChat, ...previousChats];
            });
            return;
        }

    }, [lastEvent])

    useEffect(() => {
        listChat.mutate(undefined, {
            onSuccess: (response) => {
                setChats(response);
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    const apiError = error as AxiosError<ApiError>;

                    toast.error(
                        apiError.response?.data?.detail ??
                        "Erro ao carregar atendimentos."
                    );
                } else {
                    toast.error("Erro inesperado.");
                }
            }
        })
    }, [])

    return (
        <CardDefault title={`Atendimento ${status}` } description="Seus atendimentos">
            {chats.map((chat) => (
                <ChatItem
                    key={chat.id}
                    data={chat}
                />
            ))}
        </CardDefault>
    )
}