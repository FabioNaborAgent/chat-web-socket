import { WebSocketProvider } from "@/providers/websocket-provider";

export default function ChatLayout({children,}: {children: React.ReactNode; }) {
    return (
        <WebSocketProvider>
            {children}
        </WebSocketProvider>
    );
}