import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Usuário muito curto").max(50, "Maximo de 100 caracter"),
  password: z.string().min(3, "Minimo 3 digitos").max(100, "Maximo de 100 caracter"),
});

export type LoginData = z.infer<typeof loginSchema>;
export type LoginFormData = z.output<typeof loginSchema>;