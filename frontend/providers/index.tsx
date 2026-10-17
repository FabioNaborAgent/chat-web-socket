import { QueryProvider } from "./query-provider";
import { WebSocketProvider } from "./websocket-provider";

export function Providers({children}:{children:React.ReactNode}) {
    return (
        <QueryProvider>
                {children}
        </QueryProvider>
    )
}