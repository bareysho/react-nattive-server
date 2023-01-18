import { Request, Response } from 'express';

import '@config/passport';
import { UserRepository } from '@service/repository/user.repository';

export class UserController {
  public static getUserById = (req: Request, res: Response) => async () => {
    try {
      const { params } = req;

      console.log('Request user by id:', params);

      const user = await UserRepository.findById(params.id);

      res.json(user.toJSON());
    } catch (error) {
      console.log('Request user by ID failed:', { error });

      res.send(500).json(error);
    }
  };
}
