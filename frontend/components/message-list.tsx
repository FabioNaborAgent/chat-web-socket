'use client'
import { useEffect, useState, useRef  } from "react";
import { MessageItem } from "./message-item";
import { useSession } from "@/hooks/session-hook";

export function MessageList({ messages } : {messages:ChatMessageResponse[]}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    const { data: user, isPending, isError } = useSession();

    if (isPending) return (<p>Carregando</p>);
    if (isError) return (<p>Falh ao carregar sessão</p>);



    return (
        <div className="grid gap-4 max-h-80 overflow-auto">
            {messages.map((msg) => {
                const isOwnMessage = (user.type === "client") === msg.is_client;
                return (
                    <MessageItem key={msg.id} type={user.type} message={msg.message} is_client={isOwnMessage} />
                )
            })}
            <div ref={messagesEndRef} />
        </div>
    )

}