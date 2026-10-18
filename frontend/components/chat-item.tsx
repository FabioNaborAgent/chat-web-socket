import { User2Icon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./ui/item";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { InformationDialog } from "./informations";

export function ChatItem({data}:{data:ChatListResponse}) {
    const router = useRouter()

    return (
        <Item>
            <ItemMedia variant="icon">
                <User2Icon />
            </ItemMedia>

            <ItemContent>
                <ItemTitle>{data.name}</ItemTitle>
                <ItemDescription>{data.subject} - {data.last_message ?? 'Sem Mensagem'}</ItemDescription>
            </ItemContent>

            <ItemActions>
                <InformationDialog data={data} />
                <Button onClick={() => router.push(`/chat/${data.id}`)} >Entrar</Button>
            </ItemActions>
        </Item>
    )
}