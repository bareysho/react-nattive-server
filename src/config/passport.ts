import { ErrorMessage } from '@enums/errorMessage';
import { UserCredentials } from '@models/userCredentials';
import { UserRepository } from '@service/repository/user.repository';
import { JWT_SECRET } from '@util/secrets';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    try {
      const user = await UserRepository.findByUsername(username.toLowerCase());

      if (!user) {
        return done(undefined, false, { message: ErrorMessage.UserNotFound });
      }

      const userCredentials = await UserCredentials.findOne({ where: { userId: user.id } });

      try {
        const isMatch = userCredentials.validPassword(password);

        if (isMatch) {
          return done(undefined, user);
        }

        return done(undefined, false, { message: ErrorMessage.InvalidCredentials });
      } catch (error) {
        return done(error);
      }
    } catch (error) {
      return done(error);
    }
  }),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtToken, done) => {
      try {
        const user = await UserRepository.findByUsername(jwtToken.username);

        if (user) {
          return done(undefined, user, jwtToken);
        } else {
          return done(undefined, false);
        }
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);
