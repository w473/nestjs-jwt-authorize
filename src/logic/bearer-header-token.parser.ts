import { TokenParserInterface } from 'src/logic/token.parser.interface';
import { UserInterface } from 'src/models/user.interface';

export abstract class BearerHeaderTokenParser implements TokenParserInterface {
  parseHeader(header: string): any {
    return JSON.parse(
      Buffer.from(
        header.replace('Bearer ', '').split('.')[1],
        'base64',
      ).toString(),
    );
  }

  abstract getUserFromTokenObject(jwt: any): UserInterface;
}
