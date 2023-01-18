import { RefreshToken } from '@models/refreshToken';
import { Random } from '@util/random';
import { Op } from 'sequelize';

export class RefreshTokenRepository {
  public static getRefreshTokenByToken = (token: string) => RefreshToken.findOne({ where: { token } });

  public static getUserActiveRefreshTokensByIp = (userId: string, ip: string): Promise<RefreshToken[]> =>
    RefreshToken.findAll({
      where: {
        userId,
        createdByIp: ip,
        revoked: {
          [Op.eq]: null,
        },
        expires: {
          [Op.gt]: new Date(),
        },
      },
    });

  public static createRefreshToken = (userId: string, ipAddress: string) =>
    RefreshToken.create({
      userId,
      token: Random.randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdByIp: ipAddress,
    });
}
