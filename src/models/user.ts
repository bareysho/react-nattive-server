import dbConnection from '@config/database/connection';
import { UserRole } from '@enums/userRole';
import { ITimestampAttributes, IUser, UserModelAttributes, UserModelOutput } from '@types-app/user';
import { DataTypes, Model, UUID, UUIDV4 } from 'sequelize';

export class User extends Model<UserModelOutput, UserModelAttributes> implements IUser, ITimestampAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public role!: UserRole;
  public verified: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

User.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    email: {
      type: new DataTypes.STRING(512),
      allowNull: false,
      field: 'email',
    },
    username: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      field: 'username',
    },
    verified: {
      type: new DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: false,
      field: 'verified',
    },
    role: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      defaultValue: UserRole.User,
      validate: {
        customValidator: (value) => {
          const roles = [UserRole.User, UserRole.Admin];

          if (!roles.includes(value)) {
            throw new Error('not a valid option');
          }
        },
      },
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'User',
    tableName: 'user',
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
  },
);
