import prismaClient from "../../prisma/index";

interface ListProductRequest {
    disabled?: string;
}

class ListProductService {
    async execute({ disabled  }: ListProductRequest) {
        try {
            const products = await prismaClient.product.findMany({
                where: {
                    disabled: disabled === 'true' ? true : false,
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
            throw new Error("Falha ao listar produtos");
        }
    }
}

export { ListProductService };
