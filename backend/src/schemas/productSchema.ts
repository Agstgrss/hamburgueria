import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1,{ message: "O nome do produto é obrigatorio"}),
        price: z.string().min(1,{ message: "O preço do produto é obrigatorio"}),
        description: z.string().min(1,{ message: "A descrição do produto é obrigatoria"}),
        category_id: z.string({message: "ID da categoria inválido"}),
    }),
})

export const listProductSchema = z.object({
    query: z.object({
        disabled: z.string().optional(),
    }),
});

export const listProductByCategorySchema = z.object({
    query: z.object({
        category_id: z.string({message: "ID da categoria inválido"}),
    }),
});