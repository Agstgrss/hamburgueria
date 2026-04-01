# Hamburgueria (Stack Completo)

**Visão geral rápida**: esta monorepo entrega o sistema completo de atendimento de uma hamburgueria — API RESTful com autenticação JWT e controle por roles, painel web administrativo construído com Next.js 16 e aplicativo mobile para garçons com Expo Router. O backend orquestra usuários, categorias, produtos e pedidos e é consumido simultaneamente pelos dois clientes. O histórico técnico e os endpoints estão documentados em `backend/contexto_projeto.md:1` e `backend/endpoints.md:1`.

Existe o sistema da hamburgueria para o administrador, onde é possivle criar produtos e visualizar pedidos.
Link para o proprietario:
https://hamburgueria-olive-eta.vercel.app/login

tente
<br>
"adminadmin@gmail.com"
<br>
"adminadmin"
<br>

E para o garçom, que irá criar a mesa e adicionar os produtos.
Link para o app do garçom:
<br>
https://hamburgueria-uara-git-main-agstgrss-projects.vercel.app

## Tecnologias principais
- **Backend**: Node.js >=22.12, Express 5, Prisma ORM, PostgreSQL e Cloudinary para imagens. Segurança com JWT e bcryptjs. Veja `backend/package.json:1`.
- **Frontend Web**: Next.js 16 + React 19 com Server Components, cookies armazenam o token (`cookies()` em `frontend/src/lib/auth.ts`). Requisições apontam para `API_URL`/`NEXT_PUBLIC_API_URL` (`frontend/.env.example:1`).
- **Mobile**: Expo 54 + React Native 0.81 com Expo Router, contexto de autenticação e chamadas Axios (`mobile/config/api.config.ts:1`).
- **Infra local**: PostgreSQL 15 via `docker-compose.yml:1`, Prisma migrations, Dockerfiles em cada subdiretório.

## Estrutura do repositório
- `backend/`: API Node/TypeScript, rotas MVC, middlewares (`isAuthenticated`, `isAdmin`, validações Zod). Consulte `backend/contexto_projeto.md:1` e `backend/endpoints.md:1`.
- `frontend/`: painel Next.js para login, registro e dashboard de produtos/pedidos. O `src/lib` cuida de API, auth, tipos e utilitários.
- `mobile/`: aplicativo Expo para garçons abrirem mesas, adicionarem/removerem itens e finalizar pedidos.
- `my-app/`: aplicativo Next.js independente (template) que pode permanecer isolado ou ser removido, conforme necessidade.
- `docker-compose.yml`: monta banco e serviços backend/frontend para desenvolvimento local.

## Backend (API)
### Panorama
- Auto role `STAFF` vs `ADMIN`, autenticação JWT e senha em bcrypt.
- Recursos CRUD para usuários, categorias, produtos (com upload multipart para Cloudinary) e pedidos/itens com estados `draft`/`status`.
- Prisma + PostgreSQL + migrations (`prisma/` e `prisma.config.ts`).

### Funcionalidades principais
- Registro/login (`POST /users`, `POST /session`) e rota `/me`.
- Categorias: criação (apenas ADMIN) e listagem.
- Produtos: criação com upload, listagem, filtro por categoria, desabilitação.
- Pedidos: criar, listar, detalhar, adicionar/remover itens, enviar, finalizar, deletar.

### Executando(local)
```bash
cd backend
npm install
npm run dev          # ts-node-dev com hot restart
npm run prisma:generate
npm run prisma:migrate
```

### Variáveis de ambiente
Copie `backend/.env.example` e ajuste valores: porta, `DATABASE_URL`, `JWT_SECRET`, credenciais Cloudinary. Salve em `.env`. Consulte `backend/.env.example:1`.

### Scripts úteis
- `npm run start`: gera Prisma e executa `ts-node src/server.ts`.
- `npm run dev`: desenvolvimento com `ts-node-dev`.
- `npm run dev:product`: roda com `NODE_ENV=production` para testar diferenças.
- `npm run prisma:migrate`: aplica migração local.

### Documentação da API
- Modelo e fluxos: `backend/contexto_projeto.md:1`.
- Endpoints completos: `backend/endpoints.md:1`.

## Frontend Web (Next.js)
### Panorama
- Páginas: `/login`, `/register`, e `/dashboard` (consulta produtos e abre pedidos).
- Cookies HTTP-only (`token_hamburgueria`) para manter sessão. `src/lib/api.ts` adiciona o Bearer.
- Usa `app` router com `force-dynamic` para autenticação e redirecionamentos.

### Execução
```bash
cd frontend
npm install
npm run dev          # roda Next.js em http://localhost:3000
```

### Configuração
- Defina `API_URL` e/ou `NEXT_PUBLIC_API_URL` no `.env` apontando para o backend (`http://localhost:3333`). Veja `frontend/.env.example:1`.
- Cookies e tokens são tratados no servidor (SSR), então a aplicação precisa ser executada com `process.env.NEXT_PUBLIC_API_URL` disponível.

### Observações
- Caso o backend rode em outra porta, atualize o `.env` e reinicie o Next (hot reload não detecta mudanças em `.env`).
- Para builds, `npm run build && npm run start`.

## Aplicativo Mobile (Expo)
### Panorama
- Fluxo para garçons: login (`/login`), dashboard para abrir mesa, tela de pedidos (`/order`) e finalização (`/finish`).
- AuthContext guarda `@token:hamburgueria` e `@user:hamburgueria` em AsyncStorage.
- Chama endpoints `/order`, `/order/add`, `/order/send` etc via Axios (`mobile/services/api.ts`).

### Executando
```bash
cd mobile
npm install
npm run start        # expo start (ou use `npx expo start`)
```
Use o Expo Go ou emuladores para testar. Atualize `mobile/config/api.config.ts:1` se o backend não estiver rodando em http://localhost:3333 (cada dispositivo pode precisar de IPs diferentes).

### Observações
- Expo Router organiza as rotas automaticamente (observe `(authenticated)` com telas protegidas).
- O botão `Abrir mesa` chama `POST /order`, enquanto `Adicionar`/`Remover` lidam com itens e `Finalizar` envia para cozinha.

## Banco de dados e Infra
### PostgreSQL + Prisma
- O schema em `backend/prisma/schema.prisma` define `User`, `Category`, `Product`, `Order`, `Item` e enum `Role`.
- Use `npx prisma migrate dev --name init` para gerar tabelas e `npx prisma studio` para inspecionar dados.

### Docker Compose
```bash
docker-compose up --build
```
- Levanta Postgres (`5434:5432`), backend (`3333`) e frontend (`3000`).
- Cada serviço usa o `.env` da pasta correspondente (`backend/.env`, `frontend/.env`).
- Ajuste `mobile/config/api.config.ts` para o IP do host se for testar em dispositivo físico.

## Referências e Documentação
- Contexto completo do backend e arquitetura: `backend/contexto_projeto.md:1`.
- Todos os endpoints e exemplos: `backend/endpoints.md:1`.
- Docker e serviços: `docker-compose.yml:1`.

## Próximos passos sugeridos
1. Incluir testes automatizados para cada camada (API e clientes).
2. Criar pipeline de CI/CD que execute `npm run lint` e `npm run test` em cada projeto.
3. Publicar frontend e backend com variáveis de produção seguras e entregar o app Expo com `eas build`.
