# Sistema de Atendimento - Chat

## Linguagem/Biblioteca Utilizadas

- **Python - BackEnd:** FastApi, SQLAlchemy
- **Next - FrontEnd:** Tailwind, Axios, Shadcn - componentes
- **SQLite - Banco de dados**

## Usuário para teste

- **Username:** `ws.teste`
- **Password:** `@Teste123`

## Instruções

### Inicializar projetos

**Backend**

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**

```bash
npm install
npm run build
npm run start
```

**Observação:** `.env` já está configurado em ambos.

## Fluxo

### Agente

Realiza Login → Painel de Atendimento → Acessa Atendimento → Chat

### Cliente

Preeche Formulario → Chat

## Resumo

Quando um cliente preeche um formulario, e feita a busca dos usúarios logados e conectados ao websocket com menor quantidade de atendimentos.

Caos não tenha nenhum, o atendimento não é iniciado e é informado ao cliente.

Caso tenha, é feito o vinculo do atendimento a ele, assim atualizando em sua lista de atendimento, onde podera entrar dentro do chat e trocar mensagens com o cliente.

Quando terminar, tem a opção de finalizar o atendimento. Quando finalizado, não é possivel mais enviar mensagens.
