import { Reflector } from '@nestjs/core';
import { mock, mockReset } from 'jest-mock-extended';
import { AuthenticationMiddleware } from '../../src/middlewares/authentication.middleware';
import { UnauthorizedException } from '@nestjs/common';
import { TokenParserInterface } from 'src/logic/token.parser.interface';

describe('AuthenticationMiddleware test', () => {
  let authMiddleware: AuthenticationMiddleware;
  const reflectorMock = mock<Reflector>();
  const tokenParser = mock<TokenParserInterface>();
  tokenParser.getUserFromTokenObject.mockReturnValue({
    roles: ['SYS'],
  });
  beforeEach(async () => {
    authMiddleware = new AuthenticationMiddleware('header', tokenParser);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReset(reflectorMock);
  });

  it('will return true with user in request', async () => {
    const request: any = mock<any>();
    const response: any = mock<any>();
    const functionToCall = () => {
      //nothing
    };
    request.header.mockReturnValue(
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiU1lTIl19fQ',
    );
    reflectorMock.get.mockReturnValue(false);
    authMiddleware.use(request, response, functionToCall);
    expect(request.user).toEqual({
      roles: ['SYS'],
    });
  });

  it('will throw exception due to error', async () => {
    const request: any = mock<any>();
    const response: any = mock<any>();
    const func: any = mock<any>();
    request.header.mockImplementation(() => {
      throw new Error();
    });
    reflectorMock.get.mockReturnValue(false);
    expect(() => {
      authMiddleware.use(request, response, func);
    }).toThrowError(new UnauthorizedException());
  });

  it('will throw exception due to no token', async () => {
    const request: any = mock<any>();
    const response: any = mock<any>();
    const func: any = mock<any>();
    request.header.mockReturnValue(null);
    reflectorMock.get.mockReturnValue(false);
    expect(() => {
      authMiddleware.use(request, response, func);
    }).toThrowError(new UnauthorizedException());
  });
});
