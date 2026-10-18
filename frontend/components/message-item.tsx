import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bubble, BubbleContent } from "./ui/bubble";
import { Message, MessageAvatar, MessageContent } from "./ui/message";

export function MessageItem({is_client, type, message}:{is_client:boolean, type:string, message:String}) {
    const align = is_client ? 'end' : 'start'
    return (
        <Message align={align}>
            <MessageAvatar >
                <Avatar>
                    {(align == 'end' && type == 'agent') || (align == 'start' && type == 'client') ? 
                        (<AvatarImage src="/image/prosistema.jpg" alt="@shadcn" />) 
                        : (<AvatarFallback>CL</AvatarFallback>)}
                </Avatar>
            </MessageAvatar>
            <MessageContent>
                <Bubble>
                <BubbleContent>{message}</BubbleContent>
                </Bubble>
            </MessageContent>
        </Message>
    )
}