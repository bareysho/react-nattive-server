import { UserRole } from '@enums/userRole';
import { Optional } from 'sequelize';

export interface IUser {
  id: string;
  verified: boolean;
  username: string;
  email: string;
  role: UserRole;
}

export interface IUserCredentials {
  password: string;
  salt: string;
  userId: string;
}

export interface IUserCredentialsModel extends IUserCredentials {
  validPassword: (password: string) => boolean;
}

export interface ITimestampAttributes {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type CreateUserAttributes = UserModelAttributes & { password: string };

export type UserModelAttributes = Optional<Omit<IUser, 'id'>, 'verified'>;
export type UserModelOutput = IUser & ITimestampAttributes;
