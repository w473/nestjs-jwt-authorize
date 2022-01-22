import { BearerHeaderTokenParser } from 'src/logic/bearer-header-token.parser';
import { UserInterface } from 'src/models/user.interface';

describe('AuthenticationMiddleware test', () => {
  const tokenParser = new (class extends BearerHeaderTokenParser {
    getUserFromTokenObject(jwt: any): UserInterface {
      return undefined;
    }
  })();

  it('will return true with user in request', async () => {
    const header =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    expect(tokenParser.parseHeader(header)).toEqual({
      iat: 1516239022,
      name: 'John Doe',
      sub: '1234567890',
    });
  });
});
