import { api } from "@/lib/api";
import { LoginData } from "@/schemas/login-schema";

export async function userLogin(data:LoginData):Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("login", data)
    return response.data;
}