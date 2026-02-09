import {Request, Response} from 'express';
import { AdditemOrderService } from '../../services/order/AdditemOrderService';

class AddItemController {
    async handle(req: Request, res: Response) {
        const { order_id, product_id, amount } = req.body;  

        const addItemService = new AdditemOrderService();
        const NewItem = await addItemService.execute({
            order_id: order_id,
            product_id: product_id,
            amount: amount
        });

        return res.status(201).json(NewItem);
    }
}    
export { AddItemController }