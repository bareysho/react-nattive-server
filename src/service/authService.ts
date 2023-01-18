import { ErrorMessage } from '@enums/errorMessage';
import { User } from '@models/user';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export class AuthService {
  public static authenticateJWT =
    (callback: (req: Request, res: Response, next: NextFunction) => (err: string, user: User) => void) =>
    (req: Request, res: Response, next: NextFunction) =>
      passport.authenticate('jwt', async (err, user) => {
        if (err) {
          return res.status(401).json({ message: ErrorMessage.TokenExpired });
        }

        if (!user) {
          res.status(401).json({ message: ErrorMessage.TokenExpired });
        } else {
          await callback(req, res, next)(err, user);
        }
      })(req, res, next);
}
