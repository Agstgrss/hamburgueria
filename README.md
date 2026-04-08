# Hamburgueria (Stack Completo)

**Visão geral rápida**: esta monorepo entrega o sistema completo de atendimento de uma hamburgueria — API RESTful com autenticação JWT e controle por roles, painel web administrativo construído com Next.js 16 e aplicativo mobile para garçons com Expo Router. O backend orquestra usuários, categorias, produtos e pedidos e é consumido simultaneamente pelos dois clientes. O histórico técnico e os endpoints estão documentados em `backend/contexto_projeto.md:1` e `backend/endpoints.md:1`.

---

**Testando Online**

Existe o sistema da hamburgueria para o administrador, onde é possivel criar produtos e visualizar e finalizar pedidos, também é possivel criar a conta do garçon.
<br>
<br>
Link para o sistema de adminsitração:
<br>
https://hamburgueria-olive-eta.vercel.app/login
<br>
<br>
tente
<br>
Email: adminadmin@gmail.com
<br>
Password: adminadmin
<br>

Para o garçon, utilize a conta que criou no app do adminstrador, aqui você poderá criar a mesa e adicionar os produtos, simulando o que o garçon faria em seu proprio App
<br>
<br>
Link para o app do garçon:
<br>
https://hamburgueria-uara-git-main-agstgrss-projects.vercel.app

---

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
=======
**Vis�o geral r�pida**: esta monorepo entrega o sistema completo de atendimento de uma hamburgueria � API RESTful com autentica��o JWT e controle por roles, painel web administrativo constru�do com Next.js 16 e aplicativo mobile para gar�ons com Expo Router. O backend orquestra usu�rios, categorias, produtos e pedidos e � consumido simultaneamente pelos dois clientes. O hist�rico t�cnico e os endpoints est�o documentados em `backend/contexto_projeto.md:1` e `backend/endpoints.md:1`.

## Tecnologias principais
- **Backend**: Node.js >=22.12, Express 5, Prisma ORM, PostgreSQL e Cloudinary para imagens. Seguran�a com JWT e bcryptjs. Veja `backend/package.json:1`.
- **Frontend Web**: Next.js 16 + React 19 com Server Components, cookies armazenam o token (`cookies()` em `frontend/src/lib/auth.ts`). Requisi��es apontam para `API_URL`/`NEXT_PUBLIC_API_URL` (`frontend/.env.example:1`).
- **Mobile**: Expo 54 + React Native 0.81 com Expo Router, contexto de autentica��o e chamadas Axios (`mobile/config/api.config.ts:1`).
- **Infra local**: PostgreSQL 15 via `docker-compose.yml:1`, Prisma migrations, Dockerfiles em cada subdiret�rio.

## Estrutura do reposit�rio
- `backend/`: API Node/TypeScript, rotas MVC, middlewares (`isAuthenticated`, `isAdmin`, valida��es Zod). Consulte `backend/contexto_projeto.md:1` e `backend/endpoints.md:1`.
- `frontend/`: painel Next.js para login, registro e dashboard de produtos/pedidos. O `src/lib` cuida de API, auth, tipos e utilit�rios.
- `mobile/`: aplicativo Expo para gar�ons abrirem mesas, adicionarem/removerem itens e finalizar pedidos.
- `my-app/`: aplicativo Next.js independente (template) que pode permanecer isolado ou ser removido, conforme necessidade.
- `docker-compose.yml`: monta banco e servi�os backend/frontend para desenvolvimento local.

## Backend (API)
### Panorama
- Auto role `STAFF` vs `ADMIN`, autentica��o JWT e senha em bcrypt.
- Recursos CRUD para usu�rios, categorias, produtos (com upload multipart para Cloudinary) e pedidos/itens com estados `draft`/`status`.
>>>>>>> 5d71fdc (port change)
- Prisma + PostgreSQL + migrations (`prisma/` e `prisma.config.ts`).

### Funcionalidades principais
- Registro/login (`POST /users`, `POST /session`) e rota `/me`.
<<<<<<< HEAD
- Categorias: criação (apenas ADMIN) e listagem.
- Produtos: criação com upload, listagem, filtro por categoria, desabilitação.
=======
- Categorias: cria��o (apenas ADMIN) e listagem.
- Produtos: cria��o com upload, listagem, filtro por categoria, desabilita��o.
>>>>>>> 5d71fdc (port change)
- Pedidos: criar, listar, detalhar, adicionar/remover itens, enviar, finalizar, deletar.

### Executando(local)
```bash
cd backend
npm install
npm run dev          # ts-node-dev com hot restart
npm run prisma:generate
npm run prisma:migrate
```

<<<<<<< HEAD
### Variáveis de ambiente
Copie `backend/.env.example` e ajuste valores: porta, `DATABASE_URL`, `JWT_SECRET`, credenciais Cloudinary. Salve em `.env`. Consulte `backend/.env.example:1`.

### Scripts úteis
- `npm run start`: gera Prisma e executa `ts-node src/server.ts`.
- `npm run dev`: desenvolvimento com `ts-node-dev`.
- `npm run dev:product`: roda com `NODE_ENV=production` para testar diferenças.
- `npm run prisma:migrate`: aplica migração local.

### Documentação da API
=======
### Vari�veis de ambiente
Copie `backend/.env.example` e ajuste valores: porta, `DATABASE_URL`, `JWT_SECRET`, credenciais Cloudinary. Salve em `.env`. Consulte `backend/.env.example:1`.

### Scripts �teis
- `npm run start`: gera Prisma e executa `ts-node src/server.ts`.
- `npm run dev`: desenvolvimento com `ts-node-dev`.
- `npm run dev:product`: roda com `NODE_ENV=production` para testar diferen�as.
- `npm run prisma:migrate`: aplica migra��o local.

### Documenta��o da API
>>>>>>> 5d71fdc (port change)
- Modelo e fluxos: `backend/contexto_projeto.md:1`.
- Endpoints completos: `backend/endpoints.md:1`.

## Frontend Web (Next.js)
### Panorama
<<<<<<< HEAD
- Páginas: `/login`, `/register`, e `/dashboard` (consulta produtos e abre pedidos).
- Cookies HTTP-only (`token_hamburgueria`) para manter sessão. `src/lib/api.ts` adiciona o Bearer.
- Usa `app` router com `force-dynamic` para autenticação e redirecionamentos.

### Execução
=======
- P�ginas: `/login`, `/register`, e `/dashboard` (consulta produtos e abre pedidos).
- Cookies HTTP-only (`token_hamburgueria`) para manter sess�o. `src/lib/api.ts` adiciona o Bearer.
- Usa `app` router com `force-dynamic` para autentica��o e redirecionamentos.

### Execu��o
>>>>>>> 5d71fdc (port change)
```bash
cd frontend
npm install
npm run dev          # roda Next.js em http://localhost:3000
```

<<<<<<< HEAD
### Configuração
- Defina `API_URL` e/ou `NEXT_PUBLIC_API_URL` no `.env` apontando para o backend (`http://localhost:3333`). Veja `frontend/.env.example:1`.
- Cookies e tokens são tratados no servidor (SSR), então a aplicação precisa ser executada com `process.env.NEXT_PUBLIC_API_URL` disponível.

### Observações
- Caso o backend rode em outra porta, atualize o `.env` e reinicie o Next (hot reload não detecta mudanças em `.env`).
=======
### Configura��o
- Defina `API_URL` e/ou `NEXT_PUBLIC_API_URL` no `.env` apontando para o backend (`http://localhost:3333`). Veja `frontend/.env.example:1`.
- Cookies e tokens s�o tratados no servidor (SSR), ent�o a aplica��o precisa ser executada com `process.env.NEXT_PUBLIC_API_URL` dispon�vel.

### Observa��es
- Caso o backend rode em outra porta, atualize o `.env` e reinicie o Next (hot reload n�o detecta mudan�as em `.env`).
>>>>>>> 5d71fdc (port change)
- Para builds, `npm run build && npm run start`.

## Aplicativo Mobile (Expo)
### Panorama
<<<<<<< HEAD
- Fluxo para garçons: login (`/login`), dashboard para abrir mesa, tela de pedidos (`/order`) e finalização (`/finish`).
=======
- Fluxo para gar�ons: login (`/login`), dashboard para abrir mesa, tela de pedidos (`/order`) e finaliza��o (`/finish`).
>>>>>>> 5d71fdc (port change)
- AuthContext guarda `@token:hamburgueria` e `@user:hamburgueria` em AsyncStorage.
- Chama endpoints `/order`, `/order/add`, `/order/send` etc via Axios (`mobile/services/api.ts`).

### Executando
```bash
cd mobile
npm install
npm run start        # expo start (ou use `npx expo start`)
```
<<<<<<< HEAD
Use o Expo Go ou emuladores para testar. Atualize `mobile/config/api.config.ts:1` se o backend não estiver rodando em http://localhost:3333 (cada dispositivo pode precisar de IPs diferentes).

### Observações
- Expo Router organiza as rotas automaticamente (observe `(authenticated)` com telas protegidas).
- O botão `Abrir mesa` chama `POST /order`, enquanto `Adicionar`/`Remover` lidam com itens e `Finalizar` envia para cozinha.
=======
Use o Expo Go ou emuladores para testar. Atualize `mobile/config/api.config.ts:1` se o backend n�o estiver rodando em http://localhost:3333 (cada dispositivo pode precisar de IPs diferentes).

### Observa��es
- Expo Router organiza as rotas automaticamente (observe `(authenticated)` com telas protegidas).
- O bot�o `Abrir mesa` chama `POST /order`, enquanto `Adicionar`/`Remover` lidam com itens e `Finalizar` envia para cozinha.
>>>>>>> 5d71fdc (port change)

## Banco de dados e Infra
### PostgreSQL + Prisma
- O schema em `backend/prisma/schema.prisma` define `User`, `Category`, `Product`, `Order`, `Item` e enum `Role`.
- Use `npx prisma migrate dev --name init` para gerar tabelas e `npx prisma studio` para inspecionar dados.

### Docker Compose
```bash
docker-compose up --build
```
<<<<<<< HEAD
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
=======
- Levanta Postgres (`5432:5432`), backend (`3333`) e frontend (`3000`).
- Cada servi�o usa o `.env` da pasta correspondente (`backend/.env`, `frontend/.env`).
- Ajuste `mobile/config/api.config.ts` para o IP do host se for testar em dispositivo f�sico.

## Refer�ncias e Documenta��o
- Contexto completo do backend e arquitetura: `backend/contexto_projeto.md:1`.
- Todos os endpoints e exemplos: `backend/endpoints.md:1`.
- Docker e servi�os: `docker-compose.yml:1`.

## Pr�ximos passos sugeridos
1. Incluir testes automatizados para cada camada (API e clientes).
2. Criar pipeline de CI/CD que execute `npm run lint` e `npm run test` em cada projeto.
3. Publicar frontend e backend com vari�veis de produ��o seguras e entregar o app Expo com `eas build`.
>>>>>>> 5d71fdc (port change)
