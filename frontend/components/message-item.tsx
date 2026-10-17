import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bubble, BubbleContent } from "./ui/bubble";
import { Message, MessageAvatar, MessageContent } from "./ui/message";

export function MessageItem({is_client, message}:{is_client:boolean, message:String}) {

    const align = is_client ? 'start' : 'end'

    return (
        <Message align={align}>
            <MessageAvatar >
                <Avatar>
                <AvatarImage src="/image/prosistema.jpg" alt="@shadcn" />
                <AvatarFallback>CL</AvatarFallback>
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