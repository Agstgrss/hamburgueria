# Documentação de Endpoints - Hamburgueria Backend

## Visão Geral
API RESTful para gerenciamento de Hamburgueria construída em Node.js com TypeScript. Todos os endpoints (exceto autenticação e criação de usuário) requerem autenticação via token JWT.

**Base URL:** `http://localhost:3333`

---

## Índice
1. [Autenticação e Usuários](#autenticação-e-usuários)
2. [Categorias](#categorias)
3. [Produtos](#produtos)
4. [Pedidos](#pedidos)

---

## Autenticação e Usuários

### 1. Criar Novo Usuário
**Descrição:** Registra um novo usuário na plataforma

- **Método:** `POST`
- **Rota:** `/users`
- **Autenticação:** Não requerida
- **Validação:** `createUserSchema`

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**
- `name`: string, mínimo 3 caracteres
- `email`: email válido e único
- `password`: string, mínimo 6 caracteres

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `400`: Email inválido ou já cadastrado
- `400`: Nome com menos de 3 caracteres
- `400`: Senha com menos de 6 caracteres

---

### 2. Autenticar Usuário (Login)
**Descrição:** Autentica um usuário e retorna um token de sessão

- **Método:** `POST`
- **Rota:** `/session`
- **Autenticação:** Não requerida
- **Validação:** `authUserSchema`

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**
- `email`: email válido
- `password`: obrigatório

**Response (200 OK):**
```json
{
  "session": {
    "id": "uuid-string",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "STAFF",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "createdAt": "2026-01-30T10:30:00.000Z",
    "updatedAt": "2026-01-30T10:30:00.000Z"
  }
}
```

**Erros Possíveis:**
- `400`: Email ou senha incorretos
- `400`: Usuário não encontrado

---

### 3. Obter Detalhes do Usuário Autenticado
**Descrição:** Retorna as informações do usuário autenticado

- **Método:** `GET`
- **Rota:** `/me`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** Nenhuma

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token inválido ou expirado
- `401`: Não autenticado

---

## Categorias

### 1. Criar Categoria
**Descrição:** Cria uma nova categoria de produto (apenas ADMIN)

- **Método:** `POST`
- **Rota:** `/category`
- **Autenticação:** Requerida (Bearer Token)
- **Autorização:** Apenas ADMIN
- **Validação:** `createCategorySchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Pizzas Tradicionais"
}
```

**Validações:**
- `name`: string, mínimo 2 caracteres

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "name": "Pizzas Tradicionais",
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `403`: Usuário não é ADMIN
- `400`: Nome com menos de 2 caracteres

---

### 2. Listar Todas as Categorias
**Descrição:** Lista todas as categorias cadastradas

- **Método:** `GET`
- **Rota:** `/category`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** Nenhuma

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-string-1",
    "name": "Pizzas Tradicionais",
    "createdAt": "2026-01-30T10:30:00.000Z",
    "updatedAt": "2026-01-30T10:30:00.000Z"
  },
  {
    "id": "uuid-string-2",
    "name": "Bebidas",
    "createdAt": "2026-01-30T10:35:00.000Z",
    "updatedAt": "2026-01-30T10:35:00.000Z"
  }
]
```

**Erros Possíveis:**
- `401`: Não autenticado

---

## Produtos

### 1. Criar Produto
**Descrição:** Cria um novo produto com upload de imagem (apenas ADMIN)

- **Método:** `POST`
- **Rota:** `/product`
- **Autenticação:** Requerida (Bearer Token)
- **Autorização:** Apenas ADMIN
- **Validação:** `createProductSchema`
- **Tipo:** Multipart Form Data

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Multipart):**
```
name: "Pizza Margherita"
price: "4990"
description: "Pizza clássica com queijo e tomate"
category_id: "uuid-da-categoria"
file: <arquivo de imagem>
```

**Validações:**
- `name`: string, obrigatório
- `price`: string, obrigatório (em centavos)
- `description`: string, obrigatório
- `category_id`: string válida, obrigatório
- `file`: imagem obrigatória

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "Pizza Margherita",
  "price": 4990,
  "description": "Pizza clássica com queijo e tomate",
  "banner": "https://cloudinary.com/image-url.jpg",
  "disabled": false,
  "category_id": "uuid-da-categoria",
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `403`: Usuário não é ADMIN
- `400`: Imagem não fornecida
- `400`: Dados obrigatórios faltando

---

### 2. Listar Todos os Produtos
**Descrição:** Lista todos os produtos com opção de filtro por status

- **Método:** `GET`
- **Rota:** `/products`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `listProductSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?disabled=true  (opcional - listar apenas desabilitados)
?disabled=false (opcional - listar apenas habilitados)
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-string-1",
    "name": "Pizza Margherita",
    "price": 4990,
    "description": "Pizza clássica com queijo e tomate",
    "banner": "https://cloudinary.com/image-url.jpg",
    "disabled": false,
    "category_id": "uuid-categoria",
    "createdAt": "2026-01-30T10:30:00.000Z",
    "updatedAt": "2026-01-30T10:30:00.000Z"
  },
  {
    "id": "uuid-string-2",
    "name": "Pizza Calabresa",
    "price": 5490,
    "description": "Pizza com calabresa e cebola",
    "banner": "https://cloudinary.com/image-url-2.jpg",
    "disabled": false,
    "category_id": "uuid-categoria",
    "createdAt": "2026-01-30T10:32:00.000Z",
    "updatedAt": "2026-01-30T10:32:00.000Z"
  }
]
```

**Erros Possíveis:**
- `401`: Não autenticado

---

### 3. Listar Produtos por Categoria
**Descrição:** Lista todos os produtos de uma categoria específica

- **Método:** `GET`
- **Rota:** `/category/product`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `listProductByCategorySchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?category_id=uuid-da-categoria
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-string-1",
    "name": "Pizza Margherita",
    "price": 4990,
    "description": "Pizza clássica com queijo e tomate",
    "banner": "https://cloudinary.com/image-url.jpg",
    "disabled": false,
    "category_id": "uuid-categoria",
    "createdAt": "2026-01-30T10:30:00.000Z",
    "updatedAt": "2026-01-30T10:30:00.000Z"
  }
]
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: category_id inválido ou faltando

---

### 4. Deletar Produto
**Descrição:** Desabilita um produto (marca como desabilitado, apenas ADMIN)

- **Método:** `DELETE`
- **Rota:** `/product`
- **Autenticação:** Requerida (Bearer Token)
- **Autorização:** Apenas ADMIN
- **Validação:** Nenhuma

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?product_id=uuid-do-produto
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "Pizza Margherita",
  "price": 4990,
  "description": "Pizza clássica com queijo e tomate",
  "banner": "https://cloudinary.com/image-url.jpg",
  "disabled": true,
  "category_id": "uuid-categoria",
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `403`: Usuário não é ADMIN
- `400`: product_id inválido ou faltando

---

## Pedidos

### 1. Criar Novo Pedido
**Descrição:** Cria um novo pedido para uma mesa

- **Método:** `POST`
- **Rota:** `/order`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `createOrderSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "table": 5,
  "name": "João Silva"
}
```

**Validações:**
- `table`: number, inteiro, positivo, obrigatório
- `name`: string, opcional

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "João Silva",
  "items": [],
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: Número da mesa inválido

---

### 2. Listar Pedidos
**Descrição:** Lista todos os pedidos do usuário autenticado

- **Método:** `GET`
- **Rota:** `/orders`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** Nenhuma

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-string-1",
    "table": 5,
    "status": false,
    "draft": true,
    "name": "João Silva",
    "items": [
      {
        "id": "uuid-item-1",
        "amount": 2,
        "order_id": "uuid-string-1",
        "product_id": "uuid-product-1",
        "createdAt": "2026-01-30T10:32:00.000Z",
        "updatedAt": "2026-01-30T10:32:00.000Z"
      }
    ],
    "createdAt": "2026-01-30T10:30:00.000Z",
    "updatedAt": "2026-01-30T10:32:00.000Z"
  }
]
```

**Erros Possíveis:**
- `401`: Não autenticado

---

### 3. Adicionar Item ao Pedido
**Descrição:** Adiciona um produto ao pedido (cria um item)

- **Método:** `POST`
- **Rota:** `/order/add`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `addItemSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "amount": 2
}
```

**Validações:**
- `order_id`: string, obrigatório
- `product_id`: string, obrigatório
- `amount`: number, inteiro, positivo, obrigatório

**Response (201 Created):**
```json
{
  "id": "uuid-item-string",
  "amount": 2,
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "createdAt": "2026-01-30T10:35:00.000Z",
  "updatedAt": "2026-01-30T10:35:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: order_id ou product_id inválido
- `400`: Quantidade inválida

---

### 4. Remover Item do Pedido
**Descrição:** Remove um item do pedido

- **Método:** `DELETE`
- **Rota:** `/order/remove`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `removeItemSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?item_id=uuid-do-item
```

**Response (200 OK):**
```json
{
  "id": "uuid-item-string",
  "amount": 2,
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "createdAt": "2026-01-30T10:35:00.000Z",
  "updatedAt": "2026-01-30T10:35:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: item_id inválido ou faltando

---

### 5. Obter Detalhes do Pedido
**Descrição:** Retorna o pedido com todos os seus itens e detalhes dos produtos

- **Método:** `GET`
- **Rota:** `/order/detail`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `detailOrderSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?order_id=uuid-do-pedido
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "João Silva",
  "items": [
    {
      "id": "uuid-item-1",
      "amount": 2,
      "order_id": "uuid-string",
      "product_id": "uuid-product-1",
      "product": {
        "id": "uuid-product-1",
        "name": "Pizza Margherita",
        "price": 4990,
        "description": "Pizza clássica com queijo e tomate",
        "banner": "https://cloudinary.com/image-url.jpg",
        "disabled": false,
        "category_id": "uuid-categoria"
      },
      "createdAt": "2026-01-30T10:35:00.000Z",
      "updatedAt": "2026-01-30T10:35:00.000Z"
    }
  ],
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:35:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: order_id inválido ou faltando

---

### 6. Enviar Pedido para Cozinha
**Descrição:** Muda o status do pedido de rascunho para enviado (draft = false)

- **Método:** `PUT`
- **Rota:** `/order/send`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `sendOrderSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": "uuid-do-pedido",
  "name": "João Silva"
}
```

**Validações:**
- `order_id`: string, obrigatório
- `name`: string, obrigatório

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "table": 5,
  "status": false,
  "draft": false,
  "name": "João Silva",
  "items": [
    {
      "id": "uuid-item-1",
      "amount": 2,
      "order_id": "uuid-string",
      "product_id": "uuid-product-1",
      "createdAt": "2026-01-30T10:35:00.000Z",
      "updatedAt": "2026-01-30T10:35:00.000Z"
    }
  ],
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:40:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: order_id ou name inválido/faltando

---

### 7. Marcar Pedido como Concluído
**Descrição:** Muda o status do pedido para concluído (status = true)

- **Método:** `PUT`
- **Rota:** `/order/finish`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `finishOrderSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": "uuid-do-pedido"
}
```

**Validações:**
- `order_id`: string, obrigatório

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "table": 5,
  "status": true,
  "draft": false,
  "name": "João Silva",
  "items": [
    {
      "id": "uuid-item-1",
      "amount": 2,
      "order_id": "uuid-string",
      "product_id": "uuid-product-1",
      "createdAt": "2026-01-30T10:35:00.000Z",
      "updatedAt": "2026-01-30T10:35:00.000Z"
    }
  ],
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:45:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: order_id inválido

---

### 8. Deletar Pedido
**Descrição:** Remove um pedido completamente do banco de dados

- **Método:** `DELETE`
- **Rota:** `/order/delete`
- **Autenticação:** Requerida (Bearer Token)
- **Validação:** `deleteOrderSchema`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?order_id=uuid-do-pedido
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "table": 5,
  "status": true,
  "draft": false,
  "name": "João Silva",
  "items": [],
  "createdAt": "2026-01-30T10:30:00.000Z",
  "updatedAt": "2026-01-30T10:45:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Não autenticado
- `400`: order_id inválido ou faltando

---

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| `200` | OK - Requisição bem-sucedida |
| `201` | Created - Recurso criado com sucesso |
| `400` | Bad Request - Dados inválidos ou faltando |
| `401` | Unauthorized - Não autenticado ou token inválido |
| `403` | Forbidden - Sem permissão para acessar |
| `500` | Internal Server Error - Erro no servidor |

---

## Autenticação

Todos os endpoints (exceto `POST /users` e `POST /session`) requerem autenticação via **Bearer Token** no header `Authorization`:

```
Authorization: Bearer <seu_token_jwt>
```

O token é obtido ao fazer login (`POST /session`) e deve ser incluído em todas as requisições subsequentes.

---

## Exemplo de Fluxo Completo

### 1. Criar usuário
```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"senha123"}'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:3333/session \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'
```

### 3. Usar token para criar categoria (como ADMIN)
```bash
curl -X POST http://localhost:3333/category \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pizzas"}'
```

### 4. Criar pedido
```bash
curl -X POST http://localhost:3333/order \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"table":5,"name":"João"}'
```

### 5. Adicionar item ao pedido
```bash
curl -X POST http://localhost:3333/order/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"order_id":"<order_uuid>","product_id":"<product_uuid>","amount":2}'
```

---

## Notas Importantes

- Todos os preços são armazenados em **centavos** (ex: R$49,90 = 4990)
- Imagens de produtos são armazenadas no **Cloudinary**
- O campo `disabled` em produtos marca se está ativo ou desabilitado
- O campo `draft` em pedidos indica se ainda está em rascunho (true) ou foi enviado (false)
- O campo `status` em pedidos indica se foi concluído (true) ou está pendente (false)
- A role padrão para novos usuários é **STAFF**
- Apenas usuários com role **ADMIN** podem criar categorias, produtos e deletar produtos
