import type { ChatData } from "@/schemas/chat-schema";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

export async function createChat(data:ChatData):Promise<ChatCreateResponse> {
    const response = await api.post<ChatCreateResponse>("novo-assunto", data)
    return response.data;
}