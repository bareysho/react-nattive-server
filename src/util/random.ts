import cryptoRandomString from 'crypto-random-string';

export class Random {
  public static generateDigitToken = (length: number): string => cryptoRandomString({ length, type: 'numeric' });

  public static randomTokenString = () => {
    return cryptoRandomString({ length: 40 });
  };
}
