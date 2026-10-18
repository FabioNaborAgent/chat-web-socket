'use client'
import { Message } from "@/components/message";
import { useParams } from "next/navigation";
import { Suspense } from "react";

function ChatContent() {
    
    const { id } = useParams<{ id: string }>();

    return (
        <Message chat_id={id} />
    )
}

export default function Chat() {
    return (
        <Suspense fallback={<p>Carregando conversa...</p>}>
            <ChatContent />
        </Suspense>
    );
}