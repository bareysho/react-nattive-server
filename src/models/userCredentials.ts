import dbConnection from '@config/database/connection';
import { IUserCredentials, IUserCredentialsModel } from '@types-app/user';
import crypto from 'crypto';
import { DataTypes, Model } from 'sequelize';

export class UserCredentials extends Model<IUserCredentials, IUserCredentials> implements IUserCredentialsModel {
  public password: string;
  public salt: string;
  public userId: string;

  public validPassword = (password: string): boolean => {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

    return this.password === hash;
  };
}

UserCredentials.init(
  {
    password: {
      type: new DataTypes.STRING(1024),
      allowNull: false,
      field: 'password_hash',
    },
    salt: {
      type: new DataTypes.STRING(256),
      field: 'salt',
    },
    userId: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      field: 'user_id',
      unique: true,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'UserCredentials',
    tableName: 'user_credentials',
    paranoid: true,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    hooks: {
      beforeCreate: (user) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = crypto.pbkdf2Sync(user.password, salt, 10000, 512, 'sha512').toString('hex');

        user.salt = salt;
        user.password = passwordHash;
      },
    },
  },
);
