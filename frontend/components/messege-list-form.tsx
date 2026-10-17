import { useCreateMessage, useListMessageChat } from "@/hooks/chat-hook";
import { CardDefault } from "./card-default";
import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useEffect, useState, useRef  } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { MessageItem } from "./message-item";
import { MessageData, messageSchema } from "@/schemas/message-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebSocket } from "@/providers/websocket-provider";

export function MessageListForm({chat_id}:{chat_id:string}) {

    const { lastEvent } = useWebSocket();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<ChatMessageResponse[]>([])

    const useListMessage = useListMessageChat()
    const useCreateChatMessage = useCreateMessage()

    const form = useForm({
            resolver: zodResolver(messageSchema),
            defaultValues: {
                message:""
            },
            mode: 'onBlur'
        })

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    useEffect(() => {
        if (lastEvent?.event == "new-message") {
            if (String(lastEvent.data.chat_id) == chat_id) {
                setMessages((previousChats) => {
                    const newMessage = lastEvent.data as ChatMessageResponse;
                    if (previousChats.some((message) => message.id === newMessage.id)) {
                        return previousChats;
                    }
                    return [...previousChats, newMessage];
                });
            }
            return;
        };
    }, [lastEvent])

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

    const onSubmit = (data:MessageData) => {
        useCreateChatMessage.mutate({
            chat_id:chat_id,
            data
        }, {
            onSuccess: (response) => {
                form.reset({
                    message:""
                })
                toast.success('Mensagem enviada com Sucesso!')
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    const apiError = error as AxiosError<ApiError>;

                    toast.error(
                        apiError.response?.data?.detail ??
                        "Erro ao enviar mensagem."
                    );
                } else {
                    toast.error("Erro inesperado.");
                }
            }
        })
    }

    return (
        <CardDefault title={`Chat [${chat_id}]`} description="Bate-Papo">
            {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg.message} is_client={msg.is_client} />
            ))}

            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <Field>
                    <FieldLabel>Digite uma mensagem</FieldLabel>
                    <div className="flex flex-row gap-4">
                        <Input type="text" placeholder="Olá" {...form.register("message")}/>
                        <Button type="submit" disabled={useCreateChatMessage.isPending}>{useCreateChatMessage.isPending ? "Enviado..." : "Enviar"}</Button>
                    </div>
                </Field>
            </form>

            <div ref={messagesEndRef} />
        </CardDefault>
    )
}