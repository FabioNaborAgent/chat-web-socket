**Liguagem/Biblioteca Utilizadas**
*Python - BackEnd (FastApi, SQLAlchemy)*
*Next - FrontEnd (Tailwind, Axios, Shardcn - componentes)*
*SQLite - Banco de dados*

**Usuário para teste**
    -- username: ws.teste
    -- password: @Teste123

**Estruções**

Inicializar projetos:
    *Backend*
        - pip install -r requirements.txt
        - uvicorn main:app --reload
    *Frontend*
        - npm install
        - npm run build
        - npm run start

    - .env já está configurado em ambos

Fluxo:
    *Agente*
        - Realiza Login -> Painel de Atendimento -> Acessa Atendimento -> Chat 

    *Cliente*
        - Preeche Formulario -> Chat 

Resumo:
    Quando um cliente preeche um formulario, e feita a busca dos usúarios logados e conectados ao websocket com menor quantidade de atendimentos, caos não tenha nenhum, o atendimento não é iniciado e é informado ao cliente, caso tenha é feito o vinculo do atendimento a ele, assim atualizando em sua lista de atendimento, onde podera entrar dentro do chat e trocar mensagens com o cliente e quando terminar tem a opção de finalizar o atendimento, quando finalizado não é possivel mais enviar mensagens.