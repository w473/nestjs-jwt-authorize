import { UserInterface } from 'src/models/user.interface';

export interface TokenParserInterface {
  parseHeader(header: string): any;
  getUserFromTokenObject(jwt: any): UserInterface;
}
