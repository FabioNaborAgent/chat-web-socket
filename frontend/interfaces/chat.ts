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
}

interface ChatMessageResponse {
    id:number
    message:string
    is_client:boolean
}