import { api } from "@/lib/api";
import { ChatData } from "@/schemas/chat-schema";
import { MessageData } from "@/schemas/message-schema";

export async function createChat(data:ChatData):Promise<ChatCreateResponse> {
    const response = await api.post<ChatCreateResponse>("chat", data)
    return response.data;
}

export async function listChat():Promise<ChatListResponse[]> {
    const response = await api.get<ChatListResponse[]>("chat")
    return response.data;
}

export async function createMessageChat({chat_id, data}:{chat_id:string, data:MessageData}):Promise<ChatMessageResponse> {
    const response = await api.post<ChatMessageResponse>(`chat/${chat_id}/message`, data)
    return response.data;
}

export async function listMessageChat({chat_id}:{chat_id:string}):Promise<ChatMessageResponse[]> {
    const response = await api.get<ChatMessageResponse[]>(`chat/${chat_id}/message`)
    return response.data;
}

export async function finalizedChat({chat_id}:{chat_id:string}):Promise<undefined> {
    const response = await api.put(`chat/${chat_id}`)
    return response.data;
}