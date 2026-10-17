import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

export function CardDefault({title, description, children}:{title:string, description:string, children:React.ReactNode}) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="">
                {children}
            </CardContent>
        </Card>
    )
}