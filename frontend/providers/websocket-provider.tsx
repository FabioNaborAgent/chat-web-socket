'use client'
import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode}) {

    const [status, setStatus] = useState<ConnectionStatus>("disconnected");

    const [lastEvent, setLastEvent] = useState<SocketEvent | null>(null);

    useEffect(() => {
    
        let active = true;
    
        setStatus("connecting");
    
        const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws");
    
        socket.onopen = () => {
            if (active) setStatus("connected");
        };
    
        socket.onmessage = (message) => {
            if (!active) return;
    
            try {
                const event = JSON.parse(message.data);
    
                if (
                    typeof event === "object" &&
                    event !== null &&
                    "event" in event &&
                    "data" in event &&
                    (event.event === "new-message" || event.event === "new-chat")
                    
                ) {
                    setLastEvent({
                        event: event.event,
                        data: event.data,
                    });
                }
            } catch {
                console.warn("O servidor enviou uma mensagem fora do formato JSON.");
            }
        };
    
        socket.onclose = () => {
            if (active) setStatus("disconnected");
        };
    
        socket.onerror = () => {
            if (active) setStatus("disconnected");
        };

        return () => {
            socket.close();
        };
    }, [])

    return (
        <WebSocketContext.Provider value={{ status, lastEvent }}>
            {children}
        </WebSocketContext.Provider>
    );

}

export function useWebSocket() {
    const context = useContext(WebSocketContext);

    if (context == undefined) {
        throw new Error('Falha no WebSocket')
    }

    return context;
}

