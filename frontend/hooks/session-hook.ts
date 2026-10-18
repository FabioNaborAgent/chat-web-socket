import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/session-service";

export function useSession() {
    return useQuery({
        queryKey: ["session"],
        queryFn: getMe,
        retry: false,
    });
}