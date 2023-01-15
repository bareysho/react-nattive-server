import dbConnection from '@config/database/connection';
import { DataTypes, Model } from 'sequelize';

interface IRefreshToken {
  id: number;
  userId: string;
  token: string;
  expires: Date;
  createdByIp: string;
  revoked: Date;
  revokedByIp: string;
  replacedByToken: string;
  isExpired: boolean;
  isActive: boolean;
}

export class RefreshToken extends Model<IRefreshToken, Omit<IRefreshToken, 'id'>> implements IRefreshToken {
  id: number;
  userId: string;
  token: string;
  expires: Date;
  createdByIp: string;
  revoked: Date;
  revokedByIp: string;
  replacedByToken: string;
  isExpired: boolean;
  isActive: boolean;
}

RefreshToken.init(
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
    revoked: {
      type: new DataTypes.DATE(),
      allowNull: true,
    },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date() >= this.expires;
      },
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date() >= this.revoked;
      },
    },
    userId: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      field: 'user_id',
    },
    replacedByToken: {
      type: new DataTypes.STRING(256),
      allowNull: true,
      field: 'replaced_by_token',
    },
    revokedByIp: {
      type: new DataTypes.STRING(256),
      allowNull: true,
      field: 'revoked_by_ip',
    },
    createdByIp: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      unique: false,
      field: 'created_by_ip',
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'RefreshTokens',
    tableName: 'refresh_tokens',
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  },
);
