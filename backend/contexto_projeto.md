# Documento de Contexto do Projeto - Hamburgueria Backend

## 1. Descrição do Projeto
Backend de uma aplicação de gerenciamento de Hamburgueria construído em Node.js com TypeScript. O sistema permite gerenciar usuários, categorias de produtos, produtos, pedidos e itens de pedidos com dois níveis de acesso: STAFF (funcionário comum) e ADMIN (administrador).

---

## 2. Arquitetura

A arquitetura segue o padrão **MVC (Model-View-Controller)** com separação clara de responsabilidades:

```
Rotas (routes.ts)
    ↓
Middlewares (validateSchema, isAuthenticated, isAdmin)
    ↓
Controllers (Recebem requisições)
    ↓
Services (Lógica de negócio)
    ↓
Prisma Client (ORM)
    ↓
PostgreSQL (Banco de dados)
```

### Fluxo de Requisição
1. **Rotas**: Definem os endpoints e encaminham para o controller apropriado
2. **Middlewares**: Validam schemas, autenticação e autorização
3. **Controller**: Recebe a requisição, extrai dados e passa para o service
4. **Service**: Implementa a lógica de negócio, interage com o banco de dados
5. **Resposta**: Controller retorna a resposta formatada para o usuário

---

## 3. Estrutura de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma               # Definição dos modelos de dados
│   ├── migrations/                 # Histórico de migrações
│   │   ├── migration_lock.toml
│   │   └── 20260117210050_create_tables/
│   │       └── migration.sql
│   └── ...
├── src/
│   ├── routes.ts                   # Definição de todas as rotas
│   ├── server.ts                   # Configuração do servidor Express
│   ├── @types/                     # Type definitions personalizadas
│   │   └── express/
│   │       └── index.d.ts
│   ├── config/                     # Configurações da aplicação
│   │   ├── cloudinary.ts           # Upload de imagens
│   │   └── multer.ts               # Processamento de arquivos
│   ├── controllers/                # Controllers da aplicação
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoryController.ts
│   │   ├── order/
│   │   │   ├── CreateOrderController.ts
│   │   │   ├── ListOrderControler.ts
│   │   │   ├── AdditemController.ts
│   │   │   ├── RemoveItemController.ts
│   │   │   ├── DetailOrderController.ts
│   │   │   ├── SendOrderController.ts
│   │   │   ├── FinishOrderController.ts
│   │   │   └── DeleteOrderController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── ListProductController.ts
│   │   │   ├── ListProductByCategoryController.ts
│   │   │   └── DeleteProductController.ts
│   │   └── user/
│   │       ├── CreateUserController.ts
│   │       ├── AuthUserController.ts
│   │       └── DetailUserController.ts
│   ├── middlewares/                # Middlewares da aplicação
│   │   ├── isAdmin.ts              # Verifica se usuário é ADMIN
│   │   ├── isAuthenticated.ts      # Verifica autenticação JWT
│   │   └── validateSchema.ts       # Validação com Zod
│   ├── prisma/
│   │   └── index.ts                # Instância do Prisma Client
│   ├── schemas/                    # Schemas de validação (Zod)
│   │   ├── categorySchema.ts
│   │   ├── orderSchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   └── services/                   # Lógica de negócio
│       ├── category/
│       │   ├── CreateCategoryService.ts
│       │   └── ListCategoryService.ts
│       ├── order/
│       │   ├── CreateOrderService.ts
│       │   ├── ListOrderService.ts
│       │   ├── AddItemOrderService.ts
│       │   ├── RemoveItemOrderService.ts
│       │   ├── DetailOrderService.ts
│       │   ├── SendOrderService.ts
│       │   ├── FinishOrderService.ts
│       │   └── DeleteOrderService.ts
│       ├── product/
│       │   ├── CreateProductService.ts
│       │   ├── ListProductService.ts
│       │   ├── ListProductByCategoryService.ts
│       │   └── DeleteProductService.ts
│       └── user/
│           ├── CreateUserService.ts
│           ├── AuthUserService.ts
│           └── DetailUserService.ts
├── tmp/                            # Armazenamento temporário de uploads
├── package.json
├── prisma.config.ts
├── test.sql
├── tsconfig.json
└── contexto_projeto.md             # Este arquivo
```

---

## 4. Modelagem do Banco de Dados (Prisma)

### Banco: PostgreSQL

Os modelos estão definidos no arquivo `prisma/schema.prisma` com as seguintes entidades:

#### Modelo: User
Armazena informações dos usuários do sistema.
```typescript
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String   // Hasheada com bcryptjs
  role      Role     @default(STAFF)  // STAFF ou ADMIN
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Modelo: Category
Categorias de produtos (ex: Pizzas Salgadas, Bebidas).
```typescript
model Category {
  id        String     @id @default(uuid())
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  products  Product[]  // Relação com produtos
}
```

#### Modelo: Product
Produtos disponíveis (ex: Pizza Calabresa, Refrigerante).
```typescript
model Product {
  id          String   @id @default(uuid())
  name        String
  price       Int      // Preço em centavos (ex: 5490 = R$54.90)
  description String
  banner      String   // URL da imagem no Cloudinary
  disabled    Boolean  @default(false)
  category_id String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  items       Item[]   // Relação com itens de pedido
  category    Category @relation(fields: [category_id], references: [id], onDelete: Cascade)
}
```

#### Modelo: Order
Pedidos realizados.
```typescript
model Order {
  id        String   @id @default(uuid())
  table     Int      // Número da mesa
  status    Boolean  @default(false)  // false = pendente, true = concluído
  draft     Boolean  @default(true)   // true = rascunho, false = enviado
  name      String?  // Nome do cliente (opcional)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  items     Item[]   // Relação com itens do pedido
}
```

#### Modelo: Item
Itens dentro de um pedido.
```typescript
model Item {
  id         String   @id @default(uuid())
  amount     Int      // Quantidade do produto
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  order_id   String   // FK para Order
  product_id String   // FK para Product
  order      Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)
  product    Product  @relation(fields: [product_id], references: [id])
}
```

#### Enum: Role
Roles de usuário no sistema.
```typescript
enum Role {
  STAFF  // Funcionário comum
  ADMIN  // Administrador com acesso a criar/deletar categorias e produtos

---

## 5. Funcionalidades Principais

### **Módulo de Autenticação e Usuários**
- ✅ Registrar novo usuário com validação de email único
- ✅ Autenticar usuário via JWT (login)
- ✅ Obter detalhes do usuário autenticado
- ✅ Suporte a dois níveis de acesso: STAFF e ADMIN
- ✅ Senhas hasheadas com bcryptjs

### **Módulo de Categorias**
- ✅ Criar categoria de produto (apenas ADMIN)
- ✅ Listar todas as categorias
- ✅ Relacionamento com produtos

### **Módulo de Produtos**
- ✅ Criar produto com upload de imagem (apenas ADMIN)
- ✅ Listar todos os produtos com filtro por status (disabled)
- ✅ Listar produtos por categoria específica
- ✅ Desabilitar produto (apenas ADMIN)
- ✅ Integração com Cloudinary para armazenamento de imagens

### **Módulo de Pedidos**
- ✅ Criar novo pedido para uma mesa
- ✅ Listar pedidos do usuário autenticado
- ✅ Adicionar itens ao pedido
- ✅ Remover itens do pedido
- ✅ Obter detalhes completo do pedido com seus itens
- ✅ Enviar pedido para a cozinha (alterar status draft)
- ✅ Marcar pedido como concluído (alterar status)
- ✅ Deletar pedido

---

## 6. Middlewares

### **isAuthenticated**
Valida se o usuário está autenticado via token JWT.
- **Função**: Verifica presença e validade do token no header `Authorization`
- **Extrai**: O `sub` (subject/user_id) do token
- **Resultado**: Adiciona `req.user_id` ao objeto request
- **Erro**: Status 401 se token inválido ou expirado

```typescript
export function isAuthenticated(req: Request, res: Response, next: NextFunction){
    // Valida presença do token
    // Valida o token com JWT_SECRET
    // Extrai e adiciona user_id a req.user_id
}
```

### **isAdmin**
Valida se o usuário autenticado possui role ADMIN.
- **Dependência**: Requer middleware `isAuthenticated` antes
- **Verificação**: Busca o usuário no banco e verifica sua role
- **Resultado**: Chama `next()` se for ADMIN
- **Erro**: Status 401 se não for ADMIN

```typescript
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Obtém user_id de req.user_id
    // Busca usuário no banco
    // Verifica se role === "ADMIN"
}
```

### **validateSchema**
Valida dados de requisição contra um schema Zod.
- **Função**: Valida `body`, `query` e `params`
- **Entrada**: Recebe schema Zod como parâmetro
- **Resultado**: Chama `next()` se validação passar
- **Erro**: Status 400 com detalhes do erro

```typescript
export const validateSchema = 
    (schema: ZodType) => 
    async (req: Request, res: Response, next: NextFunction) => {
        // Valida req.body, req.query, req.params
    }
```

---

## 7. Schemas de Validação (Zod)

### createUserSchema
Valida criação de novo usuário.
```typescript
export const createUserSchema = z.object({
    body: z.object({
        name: z.string({ message: "Nome precisa ser um texto" })
            .min(3, { message: "Nome precisa ter no mínimo 3 caracteres" }),
        email: z.email({ message: "Precisa ser um email válido" }),
        password: z.string()
            .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    }),
});
```

### authUserSchema
Valida autenticação de usuário (login).
```typescript
export const authUserSchema = z.object({
    body: z.object({
        email: z.email({ message: "Precisa ser um email válido" }),
        password: z.string({ message: "Senha é obrigatória" })
            .min(1, { message: "Senha é obrigatória" })
    })
})
```

### createCategorySchema
Valida criação de categoria.
```typescript
export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ message: "Categoria precisa ser um texto" })
            .min(2, { message: "Nome deve ter mais de 2 caracteres" }),
    }),
});
```

### createProductSchema
Valida criação de produto.
```typescript
export const createProductSchema = z.object({
    body: z.object({
        name: z.string({ message: "Nome precisa ser um texto" })
            .min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
        price: z.number({ message: "Preço precisa ser um número" })
            .positive({ message: "Preço deve ser um valor positivo" }),
        description: z.string({ message: "Descrição precisa ser um texto" })
            .min(5, { message: "Descrição deve ter no mínimo 5 caracteres" }),
        category_id: z.string({ message: "Category ID precisa ser um UUID" })
            .uuid({ message: "Category ID inválido" }),
    }),
});
```

### createOrderSchema
Valida criação de pedido.
```typescript
export const createOrderSchema = z.object({
    body: z.object({
        table: z.number({ message: "Número da mesa precisa ser um número" })
            .int({ message: "Número da mesa deve ser um inteiro" })
            .positive({ message: "Número da mesa deve ser positivo" }),
        name: z.string({ message: "Nome precisa ser um texto" })
            .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
            .optional(),
    }),
});
```

---

## 8. Endpoints da API

Para documentação completa sobre todos os endpoints, incluindo exemplos de requisição e resposta, consulte o arquivo [endpoints.md](endpoints.md).

### Resumo dos Endpoints por Módulo

#### Autenticação e Usuários
- `POST /users` - Criar novo usuário
- `POST /session` - Fazer login (obter token JWT)
- `GET /me` - Obter dados do usuário autenticado

#### Categorias
- `POST /category` - Criar categoria (apenas ADMIN)
- `GET /category` - Listar todas as categorias

#### Produtos
- `POST /product` - Criar produto (apenas ADMIN)
- `GET /products` - Listar todos os produtos
- `GET /category/product` - Listar produtos por categoria
- `DELETE /product` - Desabilitar produto (apenas ADMIN)

#### Pedidos
- `POST /order` - Criar novo pedido
- `GET /orders` - Listar pedidos do usuário
- `POST /order/add` - Adicionar item ao pedido
- `DELETE /order/remove` - Remover item do pedido
- `GET /order/detail` - Obter detalhes do pedido
- `PUT /order/send` - Enviar pedido para cozinha
- `PUT /order/finish` - Marcar pedido como concluído
- `DELETE /order/delete` - Deletar pedido

---

## 9. Versões das Bibliotecas Principais

### Dependências de Runtime
| Biblioteca | Versão | Descrição |
|-----------|--------|-----------|
| **express** | ^5.2.1 | Framework web para Node.js |
| **@prisma/client** | ^7.2.0 | Cliente Prisma para ORM |
| **prisma** | ^7.2.0 | ORM para Node.js e TypeScript |
| **zod** | ^4.3.5 | Validação de schemas TypeScript |
| **jsonwebtoken** | ^9.0.3 | Geração e verificação de JWTs |
| **bcryptjs** | ^3.0.3 | Hash seguro de senhas |
| **@prisma/adapter-pg** | ^7.2.0 | Adaptador PostgreSQL para Prisma |
| **pg** | ^8.17.1 | Driver PostgreSQL |
| **cors** | ^2.8.5 | Middleware CORS |
| **dotenv** | ^17.2.3 | Carregamento de variáveis de ambiente |

### Dependências de Desenvolvimento
| Biblioteca | Versão | Descrição |
|-----------|--------|-----------|
| **typescript** | ^5.9.3 | Linguagem TypeScript |
| **ts-node** | ^10.9.2 | Executar TypeScript diretamente |
| **tsx** | ^4.21.0 | TypeScript executor com hot reload |
| **@types/express** | ^5.0.6 | Type definitions para Express |
| **@types/node** | ^25.0.9 | Type definitions para Node.js |
| **@types/jsonwebtoken** | ^9.0.10 | Type definitions para JWT |
| **@types/cors** | ^2.8.19 | Type definitions para CORS |
| **@types/pg** | ^8.16.0 | Type definitions para PostgreSQL |

### Scripts Disponíveis
```json
{
  "dev": "tsx watch src/server.ts"  // Inicia servidor com hot reload
}
```

---

## 10. Variáveis de Ambiente (.env)

A aplicação utiliza as seguintes variáveis de ambiente:

```env
# Conexão com o banco de dados PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/Hamburgueria

# Secret para geração e validação de tokens JWT
JWT_SECRET=sua_chave_secreta_aqui_com_minimo_32_caracteres

# Ambiente de execução
NODE_ENV=development
```

---

## 11. Autenticação e Segurança

### Autenticação
- Implementada com **JWT (JSON Web Token)**
- Tokens gerados ao fazer login (`POST /session`)
- Tokens devem ser enviados no header: `Authorization: Bearer <token>`
- Validados no middleware `isAuthenticated`

### Segurança
- **Senhas**: Hasheadas com `bcryptjs` (salt 8)
- **Tokens**: Gerenciados pela biblioteca `jsonwebtoken` com `JWT_SECRET`
- **Autorização**: Roles (STAFF/ADMIN) verificadas no middleware `isAdmin`
- **Validação**: Todos os inputs validados com Zod antes de processar
- **CORS**: Configurado para aceitar requisições do frontend

---

## 12. Executando o Projeto

### Instalação de Dependências
```bash
npm install
```

### Configurar Variáveis de Ambiente
Criar arquivo `.env` na raiz do projeto com as variáveis listadas na seção 10.

### Criar e Migrar Banco de Dados
```bash
npx prisma migrate deploy    # Aplicar migrações existentes
npx prisma db push          # Sincronizar schema com banco
```

### Iniciar em Desenvolvimento
```bash
npm run dev
```

O servidor iniciará em `http://localhost:3333`

### Consultar e Manipular Dados (Prisma Studio)
```bash
npx prisma studio
```

---

## 13. Fluxo de Autenticação Típico

### 1. Registrar Usuário (Opcional)
```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 2. Fazer Login (Obter Token)
```bash
curl -X POST http://localhost:3333/session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
# Resposta inclui o token JWT
```

### 3. Usar Token em Requisições Subsequentes
```bash
curl -X GET http://localhost:3333/me \
  -H "Authorization: Bearer <token>"
```

---

## 14. Observações Importantes

- **Preços**: Armazenados em **centavos** (ex: R$49,90 = 4990)
- **Imagens**: Armazenadas no **Cloudinary** (URL retornada no campo `banner`)
- **Produtos**: Campo `disabled = false` indica produto ativo
- **Pedidos**: Campo `draft = true` indica rascunho (não enviado para cozinha)
- **Pedidos**: Campo `status = true` indica pedido finalizado
- **Usuários**: Role padrão para novos usuários é **STAFF**
- **Adminsitradores**: Apenas usuários com role **ADMIN** podem criar categorias/produtos

---

**Data de Criação**: Janeiro 17, 2026  
**Última Atualização**: Fevereiro 9, 2026  
**Versão**: 1.0.0  
**Status**: Em Desenvolvimento

