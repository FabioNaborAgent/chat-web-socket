'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export function CardDefault({title, description, children}:{title:string, description:string, children:React.ReactNode}) {
    const router = useRouter();
    
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 dark:bg-black sm:items-start">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => router.back()}
                                aria-label="Voltar"
                            >
                                <ArrowLeft className="size-4" />
                            </Button>

                            <CardTitle>{title}</CardTitle>
                        </div>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-7/12 overflow-auto">
                        {children}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}