import { EmailTokenType } from '@enums/emailToken';
import { EmailToken } from '@models/emailToken';
import { Random } from '@util/random';
import { addMinutes } from 'date-fns';

export class EmailTokenRepository {
  public static createEmailToken = async (userId: string, type: EmailTokenType): Promise<EmailToken> =>
    EmailToken.create({
      userId,
      type: type,
      token: Random.generateDigitToken(6),
      expires: addMinutes(new Date(), 10),
    });

  public static findEmailToken = async (userId: string, code: string, type: EmailTokenType) =>
    EmailToken.findOne({
      where: {
        type,
        userId,
        token: code,
      },
    });
}
