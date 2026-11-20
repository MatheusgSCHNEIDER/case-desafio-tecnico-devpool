# Sistema de Gerenciamento de Usuários (CRUD Full-Stack)

Aplicação full-stack para cadastro, listagem, busca, edição e exclusão de usuários, desenvolvida com arquitetura em camadas, validação de regras de negócio e interface responsiva.

---

## 📁 Estrutura do Projeto

```text
desafio-tecnico/
├── backend/    # API RESTful em Node.js, Express e SQLite
├── frontend/   # Interface SPA em Vue.js 3 e Vite
└── README.md

🛠️ Tecnologias Utilizadas

Backend

- Node.js & Express — Construção da API RESTful e roteamento.

- SQLite (better-sqlite3) — Banco de dados relacional leve e embarcado.

- Zod — Validação e sanitização de dados e regras de negócio.

- Bcrypt — Criptografia (hash) de senhas antes da persistência no banco.

- CORS — Controle de acesso entre origens (Frontend/Backend).

Frontend

- Vue.js 3 (Composition API) — Construção da interface reativa baseada em componentes.

- Vite — Ferramenta de build e servidor de desenvolvimento.

- Axios — Cliente HTTP para comunicação com a API.

- CSS3 (Grid, Flexbox & Variáveis CSS) — Estilização em tema escuro (Dark Mode) e layout responsivo.

🚀 Como Executar o Projeto Localmente

Pré-requisitos

- Node.js (versão 18 ou superior) instalado.

- Gerenciador de pacotes npm (incluso com o Node.js).

1. Executando o Backend
A partir da raiz do projeto (desafio-tecnico), acesse a pasta backend, instale as dependências e inicie o servidor pelo terminal:

# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run dev

O servidor estará rodando em http://localhost:3000. O arquivo do banco de dados SQLite (database.sqlite) é criado automaticamente na primeira execução.

2. Executando o Frontend

Abra um novo terminal na raiz do projeto (desafio-tecnico), acesse a pasta frontend, instale as dependências e inicie a aplicação:

# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

Acesse no navegador a URL exibida no terminal (geralmente http://localhost:5173).

📡 Exemplos de Chamadas à API (cURL e JSON)

Base URL: http://localhost:3000

1. Cadastrar Usuário (POST /users)
Requisição: curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tester",
    "email": "tester@exemplo.com",
    "login": "tester.silva",
    "password": "Senha123",
    "active": true
  }'

  Resposta (201 Created): {
  "id": 1,
  "name": "tester Silva",
  "email": "tester@exemplo.com",
  "login": "tester.silva",
  "active": true
}

2. Listar Todos os Usuários (GET /users)

Requisição: curl -X GET http://localhost:3000/users

Resposta (200 OK): [
  {
    "id": 1,
    "name": "tester Silva",
    "email": "tester@exemplo.com",
    "login": "tester.silva",
    "active": true
  }
]

3. Buscar Usuário por ID (GET /users/:id)

Requisição: curl -X GET http://localhost:3000/users/1

Resposta (200 OK): {
  "id": 1,
  "name": "tester Silva",
  "email": "tester@exemplo.com",
  "login": "tester.silva",
  "active": true
}

4. Buscar por Nome, Login ou E-mail (GET /users/search/:term)

Requisição: curl -X GET http://localhost:3000/users/search/tester

Resposta (200 OK): [
  {
    "id": 1,
    "name": "tester Silva",
    "email": "tester@exemplo.com",
    "login": "tester.silva",
    "active": true
  }
]

5. Atualizar Usuário (PUT /users/:id)
(O campo password é opcional na atualização — envie apenas caso deseje alterar a senha).

Requisição: curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tester Santos Silva",
    "email": "tester@exemplo.com",
    "login": "tester.silva",
    "active": false
  }'

  Resposta (200 OK): {
  "id": 1,
  "name": "Tester Santos Silva",
  "email": "tester@exemplo.com",
  "login": "tester.silva",
  "active": false
}

6. Excluir Usuário (DELETE /users/:id)

Requisição: curl -X DELETE http://localhost:3000/users/1

Resposta (200 OK): {
  "message": "Usuário excluído com sucesso."
}