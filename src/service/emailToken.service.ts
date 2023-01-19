import { EmailTokenType } from '@enums/emailToken';
import { ErrorMessage } from '@enums/errorMessage';
import { EmailToken } from '@models/emailToken';
import { EmailTokenRepository } from '@service/repository/emailToken.repository';

export class EmailTokenService {
  public static validateEmailToken = async (userId: string, code: string, type: EmailTokenType): Promise<EmailToken> => {
    const emailToken = await EmailTokenRepository.findEmailToken(userId, code, type);

    EmailTokenService.throwEmailTokenErrors(emailToken);

    return emailToken;
  };

  private static throwEmailTokenErrors = (emailToken: EmailToken): void => {
    if (!emailToken) {
      throw ErrorMessage.InvalidOtp;
    }

    if (emailToken.isExpired) {
      throw ErrorMessage.ExpiredOtp;
    }
  };
}
