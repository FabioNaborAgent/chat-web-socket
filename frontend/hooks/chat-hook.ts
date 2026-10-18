import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createChat, createMessageChat, finalizedChat, listChat, listMessageChat } from "@/services/chat-service";
import { AxiosError } from "axios";
import { ChatData } from "@/schemas/chat-schema";
import { MessageData } from "@/schemas/message-schema";

export function useCreateChat():UseMutationResult<ChatCreateResponse,AxiosError<ApiError>,ChatData> {
    return useMutation({
        mutationFn: createChat
    })
}

export function useListChat():UseMutationResult<ChatListResponse[],AxiosError<ApiError>> {
    return useMutation({
        mutationFn: listChat
    })
}

export function useCreateMessage():UseMutationResult<ChatMessageResponse,AxiosError<ApiError>, {chat_id:string, data:MessageData}> {
    return useMutation({
        mutationFn: createMessageChat
    })
}

export function useListMessageChat():UseMutationResult<ChatMessageResponse[],AxiosError<ApiError>, {chat_id:string}> {
    return useMutation({
        mutationFn: listMessageChat
    })
}

export function useFinalizedChat():UseMutationResult<undefined,AxiosError<ApiError>, {chat_id:string}> {
    return useMutation({
        mutationFn: finalizedChat
    })
}