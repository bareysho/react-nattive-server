import { EmailToken } from '@models/emailToken';
import { EmailNotificationService } from '@service/emailNotification.service';
import { EmailTokenService } from '@service/emailToken.service';
import { EmailTokenRepository } from '@service/repository/emailToken.repository';
import { UserRepository } from '@service/repository/user.repository';
import { Request, Response } from 'express';

export class EmailTokenController {
  public static verifyEmailToken = async (req: Request, res: Response) => {
    const { email, otp, type } = req.body;

    console.log(`Validate ${type} token for ${email}`);

    try {
      const user = await UserRepository.findByEmail(email);

      await EmailTokenService.validateEmailToken(user.id, otp, type);

      res.sendStatus(200);
    } catch (error) {
      console.log('Validate email code failed:', error.toString());

      res.status(500).json({ message: error });
    }
  };

  public static requestEmailToken = async (req: Request, res: Response) => {
    const { email, type } = req.body;

    console.log(`Request ${type} token for ${email}`);

    try {
      const user = await UserRepository.findByEmail(email);

      await EmailToken.destroy({
        where: {
          userId: user.id,
          type,
        },
      });

      const emailToken = await EmailTokenRepository.createEmailToken(user.id, type);
      await EmailNotificationService.sendEmail(emailToken.token, user.email);

      res.sendStatus(200);
    } catch (error) {
      console.log('Request email code failed:', error.toString());

      res.status(500).json({ error: error.toString() });
    }
  };
}
