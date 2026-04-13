import { Request, Response } from "express";
import { CreateUserService } from '../../services/user/CreateUserService';

class CreateUserController{
    async handle(req: Request, res: Response){
        const { name, email, password, role } = req.body;

        console.log({ name, email, password, role});
        
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({
            name: name,
            email: email,
            password: password,
            role: role || "STAFF"
        });  
        
        res.json(user);
    }
}

export { CreateUserController };