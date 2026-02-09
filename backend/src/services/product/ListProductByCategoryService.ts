import prismaClient from "../../prisma/index";

interface ListProductByCategoryRequest {
    category_id: string;
}

class ListProductByCategoryService {
    async execute({ category_id }: ListProductByCategoryRequest) {
        try {
            // Verifica se a categoria existe
            const category = await prismaClient.category.findUnique({
                where: {
                    id: category_id,
                }
            });

            if (!category) {
                throw new Error("Categoria não encontrada");
            }

            const products = await prismaClient.product.findMany({
                where: {
                    category_id: category_id,
                    disabled: false,
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    disabled: true,
                    category_id: true,
                    createdAt: true,
                    updatedAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return products;
        } catch (err) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("Falha ao listar produtos da categoria");
        }
    }
}

export { ListProductByCategoryService };
