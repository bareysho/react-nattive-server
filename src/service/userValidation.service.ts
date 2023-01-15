import { IUser } from '@types-app/user';

export class UserValidationService {
  public static checkFieldUniqueness = (users: IUser[], field: string, value: string) => {
    return users.map((user) => user[field]).includes(value) ? [`${field.toUpperCase()}_EXISTS`] : [];
  };

  public static isCredentialUniqueness = (users: IUser[], { email, username }: { email: string; username: string }): void => {
    const verifiedUsers = users.filter((user) => user.verified);

    const emailExistsErrors = UserValidationService.checkFieldUniqueness(verifiedUsers, 'email', email);
    const usernameExistsErrors = UserValidationService.checkFieldUniqueness(verifiedUsers, 'username', username);

    const errors = [...usernameExistsErrors, ...emailExistsErrors];

    if (errors.length) {
      throw errors;
    }
  };
}
