import prismaClient from "../../prisma/index";

class ListCategoryService {
    async execute() {
        try {
            const categories = await prismaClient.category.findMany({
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return categories;
        } catch {
            throw new Error("Falha ao listar categorias");
        }
    }
}

export { ListCategoryService };
