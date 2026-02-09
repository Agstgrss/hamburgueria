import { z } from 'zod';

export const createOrderSchema = z.object({
    body: z.object({
        table: z
            .number({ message: "Número da mesa precisa ser um número" })
            .int({ message: "Número da mesa deve ser um inteiro" })
            .positive({ message: "Número da mesa deve ser positivo" }),
        name: z
            .string({ message: "Nome do cliente precisa ser um texto" })
            .optional(),
    }),
});

export const addItemSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order deve ser uma string" })
            .min(1, { message: "ID do pedido não pode ser vazio" }),
        product_id: z
            .string({ message: "ID do produto precisa ser uma string" })
            .min(1, { message: "ID do produto não pode ser vazio" }),
        amount: z
            .number({ message: "Quantidade precisa ser um número" })
            .int({ message: "Quantidade deve ser um inteiro" })
            .positive({ message: "Quantidade deve ser positiva" }),
    }),
})

export const removeItemSchema = z.object({
    query: z.object({
        item_id: z
            .string({ message: "ID do item precisa ser uma string" })
            .min(1, { message: "ID do item não pode ser vazio" }),
    }),
});

export const detailOrderSchema = z.object({
    query: z.object({
        order_id: z
            .string({ message: "ID do pedido precisa ser uma string" })
            .min(1, { message: "ID do pedido não pode ser vazio" }),
    }),
});

export const sendOrderSchema = z.object({
    body: z.object({
        name: z
            .string({ message: "Nome do cliente precisa ser uma string" })  
            .min(1, { message: "Nome do cliente não pode ser vazio" }),
        order_id: z
            .string({ message: "ID do pedido precisa ser uma string" })
            .min(1, { message: "ID do pedido não pode ser vazio" }),
    }),
});     

export const finishOrderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "ID do pedido precisa ser uma string" }),
    }),
});

export const deleteOrderSchema = z.object({
    query: z.object({
        order_id: z
            .string({ message: "ID do pedido precisa ser uma string" })
    }),
});