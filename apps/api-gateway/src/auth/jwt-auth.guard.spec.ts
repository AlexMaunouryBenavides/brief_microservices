import { JwtAuthGuard, JwtPayload } from './jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

const validPayload: JwtPayload = { sub: 'user-1', email: 'alice@example.com', role: 'customer' };

function buildContext(authHeader?: string): ExecutionContext {
  const request: Record<string, unknown> = {
    headers: authHeader ? { authorization: authHeader } : {},
  };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const jwtService = { verify: jest.fn() };

  beforeEach(() => {
    guard = new JwtAuthGuard(jwtService as never);
    jwtService.verify.mockClear();
  });

  it('returns true and attaches user when token is valid', () => {
    jwtService.verify.mockReturnValue(validPayload);
    const ctx = buildContext('Bearer valid.token.here');

    const result = guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(jwtService.verify).toHaveBeenCalledWith('valid.token.here');
    const req = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    expect(req.user).toEqual(validPayload);
  });

  it('throws UnauthorizedException when Authorization header is missing', () => {
    expect(() => guard.canActivate(buildContext())).toThrow(UnauthorizedException);
    expect(jwtService.verify).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when header is not Bearer', () => {
    expect(() => guard.canActivate(buildContext('Basic abc123'))).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when token is invalid', () => {
    jwtService.verify.mockImplementation(() => { throw new Error('invalid'); });
    expect(() => guard.canActivate(buildContext('Bearer bad.token'))).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when token is expired', () => {
    jwtService.verify.mockImplementation(() => { throw new Error('jwt expired'); });
    expect(() => guard.canActivate(buildContext('Bearer expired.token'))).toThrow(UnauthorizedException);
  });
});
