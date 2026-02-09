import { Request, Response } from 'express';
import { AuthUserService } from '../../services/user/AuthUserService';

class authUserController{
    async handle(req: Request, res: Response){

        const { email, password } = req.body;

        const authService = new AuthUserService();

        const session = await authService.execute({ email, password});

        res.json(session)
    }
}

export { authUserController };