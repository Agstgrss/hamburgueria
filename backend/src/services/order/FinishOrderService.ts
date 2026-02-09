import prismaClient from "../../prisma";

interface FinishOrderProps {
    order_id: string;
} 

class FinishOrderService {
    async execute({ order_id }: FinishOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id,
                }
            });

            if(!order) {
                throw new Error("Falha ao finalizar o pedido");
            }

            const updateOrder = await prismaClient.order.update({ 
                where: {
                    id: order_id,
                },
                data: {
                    status: true,
                },
                select:{
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    items: true,
                },
            })
            
            return updateOrder;
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao enviar pedido para a cozinha");
        }
    }
}
export { FinishOrderService }