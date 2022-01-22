import { Reflector } from '@nestjs/core';
import { mock, mockReset } from 'jest-mock-extended';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserInterface } from 'src/models/user.interface';

describe('RolesGuard test', () => {
  let rolesGuard: RolesGuard;
  const reflectorMock = mock<Reflector>();

  beforeEach(async () => {
    rolesGuard = new RolesGuard(reflectorMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReset(reflectorMock);
  });

  it('will return true no required roles', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request = mock<any & { user: UserInterface }>();
    request.user = {
      roles: [],
    };
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValueOnce(false).mockReturnValueOnce([]);
    expect(rolesGuard.canActivate(context)).toEqual(true);
  });

  it('will return false no user', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request = mock<Request>();
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValueOnce(false).mockReturnValueOnce(['ADMIN']);
    expect(rolesGuard.canActivate(context)).toEqual(false);
  });

  it('will return true due to isPublic', async () => {
    const context = mock<ExecutionContext>();
    reflectorMock.get.mockReturnValue(true);
    expect(rolesGuard.canActivate(context)).toEqual(true);
  });

  it('will return false due to wrong roles', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request = mock<any & { user: UserInterface }>();
    const user = {
      roles: [],
    };
    user.roles = ['whatever'];
    request.user = user;
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['potato']);
    expect(rolesGuard.canActivate(context)).toEqual(false);
  });

  it('will return true - role matches', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request = mock<any & { user: UserInterface }>();
    const role = 'tomato';
    const user = {
      roles: [],
    };
    user.roles = ['whatever', role];
    request.user = user;
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValueOnce(false).mockReturnValueOnce([role]);
    expect(rolesGuard.canActivate(context)).toEqual(true);
  });
});
