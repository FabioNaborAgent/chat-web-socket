
import { CardDefault } from "@/components/card-default";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
      <CardDefault title="Escolha uma das opções" description="Solite suporte ou realize login">
        <Button>
            <Link href={'/suporte'}>Suporte</Link>
        </Button>
        <Button variant='link'>
          <Link href={'/login'}>Login</Link>
        </Button>
      </CardDefault>
  );
}
