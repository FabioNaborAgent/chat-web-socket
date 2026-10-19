import { z } from "zod";

export const messageSchema = z.object({
  message: z.string().min(1, "Digite algo").max(255, "Maximo de 255 caracter"),
});

export type MessageData = z.infer<typeof messageSchema>;
export type messageFormData = z.output<typeof messageSchema>;