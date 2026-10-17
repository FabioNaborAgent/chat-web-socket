import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoginData } from "@/schemas/login-schema";
import { userLogin } from "@/services/login-service";

export function useLogin():UseMutationResult<LoginResponse,AxiosError<ApiError>,LoginData> {
    return useMutation({
        mutationFn: userLogin
    })
}