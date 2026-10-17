'use client'
import { MessageListForm } from "@/components/messege-list-form";
import { useParams } from "next/navigation";
import { Suspense } from "react";

function ChatContent() {
    
    const { id } = useParams<{ id: string }>();

    return (
        <MessageListForm chat_id={id} />
    )
}

export default function Chat() {
    return (
        <Suspense fallback={<p>Carregando conversa...</p>}>
            <ChatContent />
        </Suspense>
    );
}