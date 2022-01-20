import { UserInterface } from 'src/models/user.interface';

export interface TokenParserInterface {
  getUserFromTokenObject(jwt: any): UserInterface;
}
