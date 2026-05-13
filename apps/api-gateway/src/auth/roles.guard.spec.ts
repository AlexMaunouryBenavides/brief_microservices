import { RolesGuard } from './roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './jwt-auth.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  const reflector = { getAllAndOverride: jest.fn() };

  beforeEach(() => {
    guard = new RolesGuard(reflector as never);
    reflector.getAllAndOverride.mockClear();
  });

  function makeCtx(user?: JwtPayload): ExecutionContext {
    const request: Record<string, unknown> = { user };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
  }

  it('returns true when no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue([]);
    expect(guard.canActivate(makeCtx())).toBe(true);
  });

  it('returns true when user has the required role', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    const user: JwtPayload = { sub: '1', email: 'a@b.com', role: 'admin' };
    expect(guard.canActivate(makeCtx(user))).toBe(true);
  });

  it('throws ForbiddenException when user role does not match', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    const user: JwtPayload = { sub: '1', email: 'a@b.com', role: 'customer' };
    expect(() => guard.canActivate(makeCtx(user))).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user is not attached to request', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    expect(() => guard.canActivate(makeCtx(undefined))).toThrow(ForbiddenException);
  });
});
