import { ErrorMessage } from '@enums/errorMessage';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import '@config/passport';
import { EmailTokenType } from '@enums/emailToken';
import { UserRole } from '@enums/userRole';
import { RefreshToken } from '@models/refreshToken';
import { User } from '@models/user';
import { AccessTokenService } from '@service/accessToken.service';
import { EmailTokenService } from '@service/emailToken.service';
import { EmailTokenRepository } from '@service/repository/emailToken.repository';
import { UserRepository } from '@service/repository/user.repository';
import { UserService } from '@service/user.service';

export class AuthController {
  public static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    return passport.authenticate('local', async (err, user: User) => {
      if (err) return next(err);

      if (!user || !user.verified) {
        return res.status(401).json({ message: ErrorMessage.InvalidCredentials });
      } else {
        const accessToken = AccessTokenService.generateAccessToken(user.username);
        const refreshToken = await AccessTokenService.generateRefreshToken(user.id, req.ip);

        console.log('Response: ', { id: user.id, token: accessToken, refreshToken: refreshToken.token });

        res.json({ id: user.id, token: accessToken, refreshToken: refreshToken.token });
      }
    })(req, res, next);
  };

  public static registerUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Request register user', req.body);

    try {
      const user = await UserService.createUser({
        email: req.body.email,
        username: req.body.username,
        role: UserRole.User,
        password: req.body.password,
      });

      await EmailTokenRepository.createEmailToken(user.id, EmailTokenType.Verification);

      res.status(200).json({ user });
    } catch (error) {
      console.log({ error });

      res.status(403).json({ message: error });
    }
  };

  public static verifyRegistration = async (req: Request, res: Response) => {
    console.log('Request verifyEmail: ', req.body);

    try {
      const { otp, email } = req.body;

      const user = await UserRepository.findByEmail(email);

      await EmailTokenService.validateEmailToken(user.id, otp, EmailTokenType.Verification);
      await UserService.updateUserById(user.id, { verified: true });

      const refreshToken = await AccessTokenService.generateRefreshToken(user.id, req.ip);
      const accessToken = AccessTokenService.generateAccessToken(user.username);

      console.log('Response: ', { ...user, token: accessToken, refreshToken: refreshToken.token });

      res.json({ id: user.id, token: accessToken, refreshToken: refreshToken.token });
    } catch (error) {
      console.log({ error });

      res.send(500).json(error);
    }
  };

  public static revokeToken = (req, res) => async (error: string, user: User) => {
    console.log('Remove token for user', { id: user.id, token: req.body.refreshToken });

    const ipAddress = req.ip;
    const token = req.body.refreshToken;

    if (!token) {
      return res.status(400).json({ message: ErrorMessage.TokenExpired });
    }

    await RefreshToken.update(
      {
        revoked: new Date(),
        revokedByIp: ipAddress,
      },
      {
        where: {
          token,
        },
      },
    );

    return res.sendStatus(200);
  };
}
