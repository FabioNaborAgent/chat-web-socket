'use client'
import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode}) {

    const [status, setStatus] = useState<ConnectionStatus>("disconnected");

    const [lastEvent, setLastEvent] = useState<SocketEvent | null>(null);

    useEffect(() => {
    
        let active = true;

        let socket: WebSocket | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let attempts = 0;
    
        setStatus("connecting");
    
        const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";

        const connect = () => {
            if (!active) return;

            setStatus('connecting');

            socket = new WebSocket(url);

            socket.onopen = () => {
                if (!active) return;
                attempts = 0;
                setStatus('connected');
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
                    console.warn("Formato não aceito");
                }
            };
        
            socket.onclose = () => {
                if (!active) return;

                setStatus('disconnected');

                const delay = Math.min(
                    1000 * 2 ** attempts,
                    30000
                );

                attempts++;

                reconnectTimer = setTimeout(connect, delay);
            };
        
            socket.onerror = () => {
                socket?.close();
            };
        }
    
        connect()

        return () => {
            active = false;
            if (reconnectTimer !== null) {
                clearTimeout(reconnectTimer);
            }
            socket?.close();
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

