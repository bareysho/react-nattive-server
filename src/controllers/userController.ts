import { Request, Response } from 'express';

import '@config/passport';
import { EmailTokenType } from '@enums/emailToken';
import { ErrorMessage } from '@enums/errorMessage';
import { EmailToken } from '@models/emailToken';
import { User } from '@models/user';
import { UserCredentials } from '@models/userCredentials';
import { EmailNotificationService } from '@service/emailNotification.service';
import { EmailTokenService } from '@service/emailToken.service';
import { EmailTokenRepository } from '@service/repository/emailToken.repository';
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

      res.send(500).json({ message: error.toString() });
    }
  };

  public static changePassword = (req: Request, res: Response) => async (_: string, authUser: User) => {
    console.log(`Request ${authUser.id} change password`);

    const { currentPassword, password } = req.body;

    try {
      const currentCredentials = await UserCredentials.findOne({ where: { userId: authUser.id } });

      const isMatch = currentCredentials.validPassword(currentPassword);

      if (!isMatch) {
        return res.status(403).json({ message: 'INVALID_CURRENT_PASSWORD' });
      }

      await currentCredentials.destroy();

      await UserCredentials.create({
        password,
        userId: authUser.id,
      });

      res.sendStatus(200);
    } catch (error) {
      console.log('Changing password failed:', error.toString());

      res.status(403).json({ message: error.toString() });
    }
  };

  public static requestChangeEmailCode = (req: Request, res: Response) => async (_: string, authUser: User) => {
    const { email } = req.body;

    console.log(`Request CHANGE_EMAIL token for ${authUser.id}`);

    try {
      const user = await UserRepository.findByEmail(email);

      if (user) {
        throw ErrorMessage.InvalidCredentials;
      }

      await EmailToken.destroy({
        where: {
          userId: authUser.id,
          type: EmailTokenType.ChangeEmail,
        },
      });

      const emailToken = await EmailTokenRepository.createEmailToken(authUser.id, EmailTokenType.ChangeEmail);
      await EmailNotificationService.sendEmail(emailToken.token, email);

      res.sendStatus(200);
    } catch (error) {
      console.log('Request email code failed:', error.toString());

      res.status(500).json({ message: error });
    }
  };

  public static verifyChangeEmail = (req: Request, res: Response) => async (_: string, authUser: User) => {
    console.log(`Request ${authUser.id} change email`);

    const { otp, email } = req.body;

    try {
      const emailToken = await EmailTokenService.validateEmailToken(authUser.id, otp, EmailTokenType.ChangeEmail);

      await authUser.update({
        email,
      });

      await emailToken.destroy();

      res.sendStatus(200);
    } catch (error) {
      console.log('Changing email failed:', error.toString());

      res.status(403).json({ message: error.toString() });
    }
  };
}
