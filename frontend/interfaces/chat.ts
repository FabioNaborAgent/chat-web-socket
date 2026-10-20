interface ChatCreateResponse {
    chat_id:number
    access_token:string
}

interface ChatListResponse {
    id:number
    name:string
    subject:string
    email:string
    telephone:string
    last_message?: string
    last_message_is_client:boolean | undefined
}

interface ChatMessageResponse {
    id:number
    chat_id:number
    message:string
    is_client:boolean
    created_at:string
}