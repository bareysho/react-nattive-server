import { User } from '@models/user';

export class UserRepository {
  public static findById = (id: string): Promise<User> =>
    User.findOne({
      where: {
        id,
      },
    });

  public static findByEmail = (email: string): Promise<User> =>
    User.findOne({
      where: {
        email,
      },
    });

  public static findByUsername = (username: string): Promise<User> =>
    User.findOne({
      where: {
        username,
      },
    });
}
