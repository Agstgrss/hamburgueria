
import prismaClient from '../../prisma/index';
import { hash } from 'bcryptjs';

interface CreateUserProps{
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    async execute({ name, email, password} : CreateUserProps){

        console.log("CreateUserService")
        console.log("name, email e password", name, email, password)
        
        const userAlreadyExists = await prismaClient.user.findFirst({
            where:{
                email: email,
            }
        })

        if(userAlreadyExists){
            throw new Error("usuario já existente!")
        }

        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data:{
                name: name,
                email: email,
                password: passwordHash,
            },
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,  
            },
        });

        return user;
    }
}

export { CreateUserService };