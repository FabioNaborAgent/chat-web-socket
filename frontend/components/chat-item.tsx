import { Clock, MessageCircle, User2Icon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./ui/item";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { InformationDialog } from "./informations";
import { Badge } from "./ui/badge";

export function ChatItem({data}:{data:ChatListResponse,}) {
    const router = useRouter()

    const formattedDate = data.last_message ? new Date(
                data.last_message.endsWith("Z")
              ? data.last_message
              : `${data.last_message}Z`
      ).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
      })
    : "-";

    const is_client = data.last_message_is_client === true || data.last_message_is_client == undefined

    const status_response = is_client
    ? (
        <span className="flex items-center gap-1 text-amber-600 ">
            <Clock size={16} />
        </span>
    )
    : (
        <span className="flex items-center gap-1 text-green-600">
            <MessageCircle size={16} />
        </span>
    );

    return (
        <Item>
            <ItemMedia variant="icon">
                <User2Icon />
            </ItemMedia>

            <ItemContent>
                <ItemTitle>[{data.id}] - {data.name.substring(0, 25)}
                    {
                        is_client
                        ? (
                            <span className="flex items-center gap-1 text-amber-600 ">
                                <Clock size={16} />
                            </span>
                        )
                        : (
                            <span className="flex items-center gap-1 text-green-600">
                                <MessageCircle size={16} />
                            </span>
                        )
                    }
                </ItemTitle>
                <div>
                    <h3 className="font-medium text-sm">{data.subject}</h3>
                </div>
                <ItemDescription>
                    Última messagem: {formattedDate} {' * '}
                    {is_client ? (<Badge className="bg-amber-500">Cliente</Badge>) : (<Badge className="bg-green-500">Você</Badge>)}
                </ItemDescription>
            </ItemContent>

            <ItemActions>
                <InformationDialog data={data} />
                <Button onClick={() => router.push(`/chat/${data.id}`)} >Entrar</Button>
            </ItemActions>
        </Item>
    )
}