import { Request, Response } from 'express';
import { GetLastThreeMessagesService } from '../services/GetLastThreeMessagesService';

export class GetLastThreeMessagesController {
  async handle(request: Request, response: Response) {
    const service = new GetLastThreeMessagesService();

    const results = await service.execute();

    return response.json(results);
  }
}
