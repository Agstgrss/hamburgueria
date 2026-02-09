import multer from 'multer';

//Usar o memory storage do multer para armazenar arquivos na memória e enviar direto para o Cloudinary
export default{
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 5 * 1024 * 1024, //5MB
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedMimes = [
            'image/jpg',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo inválido, use jpg, png ou gif"));
        }
    },
};