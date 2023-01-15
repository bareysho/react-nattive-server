import { EmailTokenService } from '@service/emailToken.service';
import { UserRepository } from '@service/repository/user.repository';
import { Request, Response } from 'express';

export class EmailTokenController {
  public static verifyEmailToken = async (req: Request, res: Response) => {
    console.log('Request unauthorizedVerifyCode: ', req.body);

    try {
      const { email, otp, type } = req.body;

      const user = await UserRepository.findByEmail(email);

      await EmailTokenService.validateEmailToken(user.id, otp, type);

      res.sendStatus(200);
    } catch (error) {
      console.log({ error });

      res.send(500).json(error);
    }
  };
}
