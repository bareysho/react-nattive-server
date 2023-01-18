import { ErrorMessage } from '@enums/errorMessage';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import '@config/passport';
import { IS_DEVELOPMENT } from '@constants/common';
import { EmailTokenType } from '@enums/emailToken';
import { UserRole } from '@enums/userRole';
import { RefreshToken } from '@models/refreshToken';
import { User } from '@models/user';
import { AccessTokenService } from '@service/accessToken.service';
import { EmailTokenService } from '@service/emailToken.service';
import { EmailTokenRepository } from '@service/repository/emailToken.repository';
import { RefreshTokenRepository } from '@service/repository/refreshToken.repository';
import { UserRepository } from '@service/repository/user.repository';
import { UserService } from '@service/user.service';

export class AuthController {
  public static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    console.log('Request login user', req.body.username);

    return passport.authenticate('local', async (_, user: User) => {
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

    const dbName = process.env.DB_NAME as string;
    const dbUser = process.env.DB_USER as string;
    const dbHost = process.env.DB_HOST;
    const dbPassword = process.env.DB_PASSWORD;

    console.log({ dbName, dbUser, dbHost, dbPassword });
    console.log({ dbName, dbUser, dbHost, dbPassword });

    try {
      const user = await UserService.createUser({
        email: req.body.email,
        username: req.body.username,
        role: UserRole.User,
        password: req.body.password,
      });

      await EmailTokenRepository.createEmailToken(user.id, EmailTokenType.Verification);

      res.sendStatus(200);
    } catch (error) {
      console.log('ERROR', { message: error.toString() });

      res.status(403).json({ message: error.toString() });
    }
  };

  public static verifyRegistration = async (req: Request, res: Response) => {
    console.log('Registration verification: ', req.body);

    try {
      const { otp, email } = req.body;

      const user = await UserRepository.findByEmail(email);

      if (otp === '000000' && IS_DEVELOPMENT) {
        console.log('Skip otp verification on DEV');
      } else {
        await EmailTokenService.validateEmailToken(user.id, otp, EmailTokenType.Verification);
        await UserService.updateUserById(user.id, { verified: true });
      }

      const refreshToken = await AccessTokenService.generateRefreshToken(user.id, req.ip);
      const accessToken = AccessTokenService.generateAccessToken(user.username);

      console.log('Response: ', { ...user, token: accessToken, refreshToken: refreshToken.token });

      res.json({ id: user.id, token: accessToken, refreshToken: refreshToken.token });
    } catch (error) {
      console.log('Registration verification failed:', { error });

      res.status(500).json({ message: error.toString() });
    }
  };

  public static revokeToken = (req, res) => async (_: string, user: User) => {
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

    return res.status(200).json({ message: ErrorMessage.TokenRevoked });
  };

  public static refreshToken = async (req: Request, res: Response) => {
    console.log('Access token expired, try refresh');

    try {
      const token = req.body.refreshToken;
      const ipAddress = req.ip;

      const requestRefreshToken = await RefreshTokenRepository.getRefreshTokenByToken(token);

      if (!requestRefreshToken || requestRefreshToken.isExpired || requestRefreshToken.revoked) {
        return res.status(400).json({ message: ErrorMessage.InvalidRefreshToken });
      }

      const refreshToken = await RefreshTokenRepository.createRefreshToken(requestRefreshToken.userId, ipAddress);

      await requestRefreshToken.update({
        revoked: new Date(),
        replacedByToken: refreshToken.token,
        revokedByIp: ipAddress,
      });

      const user = await UserRepository.findById(requestRefreshToken.userId);

      const accessToken = AccessTokenService.generateAccessToken(user.username);

      console.log('Refresh success:', { id: refreshToken.userId, token: accessToken, refreshToken: refreshToken.token });

      res.status(200).json({ id: refreshToken.userId, token: accessToken, refreshToken: refreshToken.token });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  };
}
