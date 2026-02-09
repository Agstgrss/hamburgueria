import prismaClient from "../../prisma";

interface SendOrderProps {
    name: string;
    order_id: string;
} 

class SendOrderService {
    async execute({ name, order_id }: SendOrderProps) {
        try {

            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id,
                    draft: true,
                }
            });

            if(!order) {
                throw new Error("Pedido não encontrado ou já enviado para a cozinha");
            }

            const updateOrder = await prismaClient.order.update({ 
                where: {
                    id: order_id,
                },
                data: {
                    draft: false,
                    name: name,
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
                }
            })
            
            return updateOrder;

        } catch (error) {
            throw new Error("Erro ao enviar pedido para a cozinha");
        }
    }
}
export { SendOrderService }