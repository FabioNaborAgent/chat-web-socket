'use client'
import { CardDefault } from "@/components/card-default";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";


import { useParams } from "next/navigation";

export default function Chat() {
    
    const { id } = useParams<{ id: string }>();

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <CardDefault title="Chat" description="Mande suas perguntas">
                    <Message>
                        <MessageAvatar>
                            <Avatar>
                            <AvatarImage src="/image/prosistema.jpg" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                            <Bubble>
                            <BubbleContent>How can I help you today?</BubbleContent>
                            </Bubble>
                        </MessageContent>
                    </Message>
                        <Field>
                            <FieldLabel>Digite uma mensagem</FieldLabel>
                            <div className="flex flex-row gap-4">
                                <Input type="text" placeholder="Olá" />
                                <Button>Enviar</Button>
                            </div>
                            {/* <FieldError>{form.formState.errors.name?.message}</FieldError> */}
                        
                        </Field>
                </CardDefault>
            </main>
        </div>
    )
}