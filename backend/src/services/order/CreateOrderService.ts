import prismaClient from '../../prisma/index';

interface CreateOrderRequest {
    table: number;
    name?: string;
}

class CreateOrderService {
    async execute({ table, name }: CreateOrderRequest) {
        try {
            const order = await prismaClient.order.create({
                data: {
                    table: table,
                    name: name ?? "",
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return order;
        } catch (err) {
            throw new Error("Falha ao criar pedido");
        }
    }
}

export { CreateOrderService };
