import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createChat } from "@/services/chat-service";
import { AxiosError } from "axios";
import { ChatData } from "@/schemas/chat-schema";

export function useCreateChat():UseMutationResult<ChatCreateResponse,AxiosError<ApiError>,ChatData> {
    return useMutation({
        mutationFn: createChat
    })
}