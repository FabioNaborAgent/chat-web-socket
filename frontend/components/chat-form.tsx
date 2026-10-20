'use client'
import { formatPhone } from "@/utils/format-tel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatSchema, ChatFormData } from "@/schemas/chat-schema";
import { useCreateChat } from "@/hooks/chat-hook";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { CardDefault } from "./card-default";
import { useRouter } from "next/navigation";


export function ChatForm() {

    const router = useRouter();

    const createChat = useCreateChat();

    const form = useForm({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            name:"",
            subject:"",
            email:"",
            telephone:"",
        },
        mode: 'onBlur'
    })

    const onSubmit = (data:ChatFormData) => {
        createChat.mutate(data, {
            onSuccess: (response) => {
                router.replace(`/chat/${response.chat_id.toString()}`)
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    const apiError = error as AxiosError<ApiError>;

                    toast.error(
                        apiError.response?.data?.detail ??
                        "Erro ao iniciar atendimento."
                    );
                } else {
                    toast.error("Erro inesperado.");
                }
            }
        })
    }

    return (
        <CardDefault title="Solicitar Suporte" description="Preecha os campos abaixo para iniciar um novo atendimento">
              
              <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                  <Field>
                      <FieldLabel>Nome</FieldLabel>
                      <Input type="text" placeholder="Nome Completo" {...form.register("name")} />
                      <FieldError>{form.formState.errors.name?.message}</FieldError>
                  </Field>
                  <Field>
                      <FieldLabel>Assunto</FieldLabel>
                      <Input type="text" placeholder="Asunto Ex. Manutenção" {...form.register("subject")} />
                      <FieldError>{form.formState.errors.subject?.message}</FieldError>
                  </Field>
                  <Field>
                      <FieldLabel>E-Mail</FieldLabel>
                      <Input type="text" placeholder="exemplo@gmail.com" {...form.register("email")}/>
                      <FieldError>{form.formState.errors.email?.message}</FieldError>
                  </Field>
                  <Field>
                      <FieldLabel>Telefone</FieldLabel>
                      <Input 
                          type="tel" 
                          placeholder="(35) 998824321"
                          {...form.register("telephone", {
                                onChange: (e) => {
                                    form.setValue(
                                        "telephone",
                                        formatPhone(e.target.value),
                                        { shouldValidate: true }
                                    );
                                },
                           })} />
                        <FieldError>{form.formState.errors.telephone?.message}</FieldError>
                  </Field>
                  <Button type="submit" disabled={createChat.isPending}>{createChat.isPending ? "Iniciando..." : "Iniciar"}</Button>
              </form>
        </CardDefault>
    )
}