import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

export function CardDefault({title, description, children}:{title:string, description:string, children:React.ReactNode}) {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-auto">
                        {children}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}