
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface NewMessage {
    id:number
    chat_id:number
    is_client:boolean
    message:string
    created_at:string
}
interface NewChat{
    id: number,
    name: string,
    subject: string,
    email:string,
    telephone:string,
    user_id: number,
    client_id: number
}
type SocketEvent =
    | {
        event: "new-message";
        data: NewMessage;
    }
    | {
        event: "new-chat";
        data: NewChat;
    };
    
interface WebSocketContextType {
    status: ConnectionStatus
    lastEvent: SocketEvent | null;
};

