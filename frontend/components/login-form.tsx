'use client'
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { CardDefault } from "./card-default";
import { useLogin } from "@/hooks/login-hook";
import { LoginFormData, loginSchema } from "@/schemas/login-schema";

import { useRouter } from "next/navigation";


export function LoginForm() {
    const router = useRouter()
    const userLogin = useLogin();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username:"",
            password:"",
        },
        mode: 'onBlur'
    })

    const onSubmit = (data:LoginFormData) => {
        userLogin.mutate(data, {
            onSuccess: (response) => {
                router.replace('/chat')
                toast.success('Login Realizado com Sucesso!')
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    const apiError = error as AxiosError<ApiError>;

                    toast.error(
                        apiError.response?.data?.detail ??
                        "Erro ao fazer login."
                    );
                } else {
                    toast.error("Erro inesperado.");
                }
            }
        })
    }

    return (
        <CardDefault title="Faça Login" description="Inicie o atendimento dos clientes">
              <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                  <Field>
                      <FieldLabel>Usuário</FieldLabel>
                      <Input type="text" placeholder="Usuário" {...form.register("username")} />
                      <FieldError>{form.formState.errors.username?.message}</FieldError>
                  </Field>
                  <Field>
                      <FieldLabel>Senha</FieldLabel>
                      <Input type="password" placeholder="***********" {...form.register("password")} />
                      <FieldError>{form.formState.errors.password?.message}</FieldError>
                  </Field>
                  <Button type="submit" disabled={userLogin.isPending}>{userLogin.isPending ? "Acessando..." : "Acessar"}</Button>
              </form>
        </CardDefault>
    )
}