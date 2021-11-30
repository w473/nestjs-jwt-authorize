import { Reflector } from '@nestjs/core';
import { mock, mockReset } from 'jest-mock-extended';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { AuthorizationGuard } from 'src/authorization.guard';

describe('AuthorizationGuard test', () => {
  let authGuard: AuthorizationGuard;
  const reflectorMock = mock<Reflector>();

  beforeEach(async () => {
    authGuard = new AuthorizationGuard(reflectorMock, 'header');
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReset(reflectorMock);
  });

  it('will return false due error', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request: any = mock<any>();
    request.header.mockImplementation(() => {
      throw new Error();
    });
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValue(false);
    expect(authGuard.canActivate(context)).toEqual(false);
  });

  it('will return true with user in request', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request: any = mock<any>();
    request.header.mockReturnValue(
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiU1lTIl19fQ',
    );
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValue(false);
    expect(authGuard.canActivate(context)).toEqual(true);
    expect(request.user).toEqual({
      roles: ['SYS'],
    });
  });

  it('will return false due to no token', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request: any = mock<any>();
    request.header.mockReturnValue(null);
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValue(false);
    expect(authGuard.canActivate(context)).toEqual(false);
  });

  it('will return true due isPublic', async () => {
    const context = mock<ExecutionContext>();
    reflectorMock.get.mockReturnValue(true);
    expect(authGuard.canActivate(context)).toEqual(true);
  });
});
