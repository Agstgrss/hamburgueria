import { Readable } from "node:stream";
import prismaClient from "../../prisma/index";
import cloudinary from "../../config/cloudinary";   

interface UpdateProductProps {
    product_id: string;
    name?: string;
    price?: number;  
    description?: string;
    category_id?: string;
    imageBuffer?: Buffer;
    imageName?: string;
}

class UpdateProductService {
    async execute({
        product_id,
        name,
        price,
        description,
        category_id,
        imageBuffer,
        imageName
    }: UpdateProductProps){

        const productExists = await prismaClient.product.findFirst({
            where:{
                id: product_id
            }
        });

        if(!productExists){
            throw new Error("Produto não existe");
        }

        // Validar se outro produto com o mesmo nome já existe (se o nome está sendo alterado)
        if(name && name !== productExists.name) {
            const duplicateName = await prismaClient.product.findFirst({
                where:{
                    name: name,
                    id: { not: product_id },
                    disabled: false
                }
            });

            if(duplicateName){
                throw new Error("Já existe outro produto com este nome");
            }
        }

        // Validar categoria se está sendo alterada
        if(category_id && category_id !== productExists.category_id) {
            const categoryExists = await prismaClient.category.findFirst({
                where:{
                    id: category_id
                }
            });

            if(!categoryExists){
                throw new Error("Categoria não existe");
            }
        }

        let bannerUrl = productExists.banner;

        // Se uma nova imagem foi enviada, fazer upload dela
        if(imageBuffer && imageName) {
            try {
                // Deletar imagem antiga do Cloudinary se existir
                if(productExists.banner) {
                    const publicId = productExists.banner.split('/').pop()?.split('.')[0];
                    if(publicId) {
                        try {
                            await cloudinary.uploader.destroy(`products/${publicId}`);
                        } catch (error) {
                            console.log("Erro ao deletar imagem antiga:", error);
                        }
                    }
                }

                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "products",
                            resource_type: "image",
                            public_id: `${Date.now()}-${imageName.split(".")[0]}`,
                        }, 
                        (error, result) => {
                                if (error) reject(error); 
                                else resolve(result);
                        }
                    );

                    const bufferStream = Readable.from(imageBuffer);
                    bufferStream.pipe(uploadStream);
                });

                bannerUrl = result.secure_url;

            } catch (error) {
                console.log("Erro ao fazer o upload para o Cloudinary:", error);
                throw new Error("Erro ao fazer o upload da imagem");
            }
        }

        const product = await prismaClient.product.update({
            where: {
                id: product_id
            },
            data:{
                ...(name && { name: name }),
                ...(price && { price: price }),
                ...(description && { description: description }),
                ...(category_id && { category_id: category_id }),
                ...(bannerUrl !== productExists.banner && { banner: bannerUrl }),
                updatedAt: new Date()
            },
            select:{
                id: true,
                name: true,
                description: true,
                category_id: true,   
                banner: true,
                price: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return (product);
    } 
}

export { UpdateProductService };
