import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";


export function InformationDialog( {data}: {data:ChatListResponse}) {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline">Informações</Button>} />
            <DialogContent showCloseButton={false}>
                <Field>
                    <FieldLabel>Nome</FieldLabel>
                    <Input type="text" placeholder={data.name} disabled/>
                </Field>
                <Field>
                    <FieldLabel>Assunto</FieldLabel>
                    <Input type="text" placeholder={data.subject} disabled/>
                </Field>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="text" placeholder={data.email} disabled/>
                </Field>
                <Field>
                    <FieldLabel>Telefone</FieldLabel>
                    <Input type="text" placeholder={data.telephone} disabled/>
                </Field>
            </DialogContent>
        </Dialog>
    )
}