import { z } from "zod";

export const chatSchema = z.object({
  name: z.string().min(3, "Nome muito curto").max(100, "Maximo de 100 caracter"),
  subject: z.string().min(3, "Assunto muito curto").max(100, "Maximo de 100 caracter"),
  email: z.email("E-mail inválido"),
  telephone: z.string().transform((value) => value.replace(/\D/g, "")).pipe(
    z.string().length(11, 'Telefone deve ter 11 números')
  )
});

export type ChatData = z.infer<typeof chatSchema>;
export type ChatFormData = z.output<typeof chatSchema>;