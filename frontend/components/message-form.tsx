import { useCreateMessage, useFinalizedChat } from "@/hooks/chat-hook";
import { MessageData, messageSchema } from "@/schemas/message-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useRouter } from "next/navigation";

export function MessageForm({chat_id}:{chat_id:string}) {
    const router = useRouter()
    const useCreateChatMessage = useCreateMessage()
    const useFinalized = useFinalizedChat()

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            message:""
        },
        mode: 'onBlur'
    })

    const onFinalized = () => {
        useFinalized.mutate({
            chat_id:chat_id
        }, {
            onSuccess: () => {
                router.replace('/chat')
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    const apiError = error as AxiosError<ApiError>;

                    toast.error(
                        apiError.response?.data?.detail ??
                        "Erro ao finalizar."
                    );
                } else {
                    toast.error("Erro inesperado.");
                }
            }
        })
    }

    const onSubmit = (data:MessageData) => {
        useCreateChatMessage.mutate({
            chat_id:chat_id,
            data
        }, {
            onSuccess: () => {
                form.reset({message:""})
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
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Field>
                <FieldLabel>Digite uma mensagem</FieldLabel>
                <div className="flex flex-row gap-4">
                    <Input type="text" placeholder="Olá" {...form.register("message")}/>
                    <Button type="submit" disabled={useCreateChatMessage.isPending}>{useCreateChatMessage.isPending ? "Enviado..." : "Enviar"}</Button>
                    <Button variant='destructive' type="button" onClick={onFinalized} disabled={useFinalized.isPending}>{useFinalized.isPending ? "Finalizando..." : "Finalizar"}</Button>
                </div>
                <FieldError>{form.formState.errors.message?.message}</FieldError>
            </Field>
        </form>
    );
    
}