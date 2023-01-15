import { RefreshToken } from '@models/refreshToken';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenRepository } from './repository/refreshToken.repository';

export class AccessTokenService {
  public static generateRefreshToken = async (userId: string, ipAddress: string): Promise<RefreshToken> => {
    const existingRefreshTokens = await RefreshTokenRepository.getUserActiveRefreshTokensByIp(userId, ipAddress);

    const refreshToken = await RefreshTokenRepository.createRefreshToken(userId, ipAddress);

    for (const existingRefreshToken of existingRefreshTokens) {
      await existingRefreshToken.update({
        revoked: new Date(),
        replacedByToken: refreshToken.token,
        revokedByIp: ipAddress,
      });
    }

    return refreshToken;
  };

  public static generateAccessToken = (username: string): string =>
    jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });
}
