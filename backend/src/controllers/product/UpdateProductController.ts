import { Request, Response } from 'express';
import { UpdateProductService } from '../../services/product/UpdateProductService';

class UpdateProductController {
    async handle(req: Request, res: Response) {
        const { name, price, description, category_id, product_id } = req.body;

        const updateProduct = new UpdateProductService();
        
        const product = await updateProduct.execute({
            product_id: product_id,
            name: name,
            price: price ? parseInt(price) : undefined,
            description: description,
            category_id: category_id,
            imageBuffer: req.file?.buffer,
            imageName: req.file?.originalname
        });

        res.json(product);
    }
}

export { UpdateProductController };
