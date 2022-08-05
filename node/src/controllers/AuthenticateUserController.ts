import { Request, Response } from 'express';
import { AuthenticatUserService } from '../services/AuthenticateUserService';

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;

    const service = new AuthenticatUserService();

    try {
      const result = await service.execute(code);

      return response.json(result);
    } catch (error) {
      return response.json({ error: error.message });
    }
  }
}
