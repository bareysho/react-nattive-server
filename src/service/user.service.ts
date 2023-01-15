import { User } from '@models/user';
import { UserCredentials } from '@models/userCredentials';
import { UserValidationService } from '@service/userValidation.service';
import { CreateUserAttributes, IUser, UserModelOutput } from '@types-app/user';

export class UserService {
  public static updateUserById = async (userId: string, { username, email, role, verified }: Partial<IUser>): Promise<void> => {
    await User.update({ username, email, role, verified }, { where: { id: userId } });
  };

  public static createUser = async ({ username, role, email, password }: CreateUserAttributes): Promise<UserModelOutput> => {
    const [user, created] = await User.findOrCreate({
      where: { username, email },
      defaults: { role },
    });

    if (!created && user.verified) {
      UserValidationService.isCredentialUniqueness([user], { username, email });
    }

    await UserCredentials.destroy({
      where: {
        userId: user.id,
      },
    });

    await UserCredentials.create({
      password,
      userId: user.id,
    });

    return user;
  };
}
