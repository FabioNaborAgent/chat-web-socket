import { User2Icon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./ui/item";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { InformationDialog } from "./informations";

export function ChatItem({data}:{data:ChatListResponse}) {
    const router = useRouter()

    const formattedDate = data.last_message ? new Date(
                data.last_message.endsWith("Z")
              ? data.last_message
              : `${data.last_message}Z`
      ).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
      })
    : "Sem Mensagem";

    return (
        <Item>
            <ItemMedia variant="icon">
                <User2Icon />
            </ItemMedia>

            <ItemContent>
                <ItemTitle>{data.name}</ItemTitle>
                <ItemDescription>{data.subject} - {formattedDate}</ItemDescription>
            </ItemContent>

            <ItemActions>
                <InformationDialog data={data} />
                <Button onClick={() => router.push(`/chat/${data.id}`)} >Entrar</Button>
            </ItemActions>
        </Item>
    )
}