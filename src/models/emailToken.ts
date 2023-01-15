import dbConnection from '@config/database/connection';
import { EmailTokenType } from '@enums/emailToken';
import { DataTypes, Model } from 'sequelize';

interface IEmailToken {
  id: number;
  token: string;
  userId: string;
  expires: Date;
  type: EmailTokenType;
  isExpired: boolean;
}

export class EmailToken extends Model<IEmailToken, Omit<IEmailToken, 'id'>> implements IEmailToken {
  public id: number;
  public token: string;
  public expires: Date;
  public type: EmailTokenType;
  public userId: string;
  public isExpired: boolean;
}

EmailToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      field: 'token',
    },
    expires: {
      type: new DataTypes.DATE(),
      allowNull: false,
    },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date() >= this.expires;
      },
    },
    userId: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      field: 'user_id',
      unique: true,
    },
    type: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      validate: {
        customValidator: (value) => {
          const types = [EmailTokenType.Verification, EmailTokenType.Recovery];

          if (!types.includes(value)) {
            throw new Error('Not a valid option');
          }
        },
      },
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'EmailTokens',
    tableName: 'email_tokens',
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  },
);
