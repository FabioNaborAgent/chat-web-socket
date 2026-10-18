import { SessionUser } from "@/interfaces/session";
import { api } from "@/lib/api";

export async function getMe(): Promise<SessionUser> {
    const response = await api.get<SessionUser>('/me');
    return response.data
}