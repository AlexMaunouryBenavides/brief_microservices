import { DownstreamExceptionFilter } from './downstream-exception.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

function buildHost(responseMock: { status: jest.Mock; json: jest.Mock }): ArgumentsHost {
  return {
    switchToHttp: () => ({ getResponse: () => responseMock }),
  } as unknown as ArgumentsHost;
}

function buildAxiosError(status: number, data: unknown): AxiosError {
  return {
    response: { status, data },
  } as unknown as AxiosError;
}

describe('DownstreamExceptionFilter', () => {
  let filter: DownstreamExceptionFilter;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    filter = new DownstreamExceptionFilter();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('returns only message and error — strips stack and internal fields', () => {
    const error = buildAxiosError(404, {
      message: 'Not found',
      error: 'NotFound',
      stack: 'Error: Not found\n    at Object.<anonymous>...',
      internalData: { dbQuery: 'SELECT * FROM users' },
    });

    filter.catch(error, buildHost({ status, json }));

    expect(status).toHaveBeenCalledWith(404);
    const body = json.mock.calls[0][0] as Record<string, unknown>;
    expect(body).toEqual({ message: 'Not found', error: 'NotFound' });
    expect(body).not.toHaveProperty('stack');
    expect(body).not.toHaveProperty('internalData');
  });

  it('uses safe defaults when downstream provides no message or error', () => {
    const error = buildAxiosError(500, null);

    filter.catch(error, buildHost({ status, json }));

    expect(json.mock.calls[0][0]).toEqual({ message: 'Service error', error: 'ServiceError' });
  });

  it('falls back to BAD_GATEWAY when downstream response is absent', () => {
    const error = { response: undefined } as unknown as AxiosError;

    filter.catch(error, buildHost({ status, json }));

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
  });

  it('does not expose non-string message values', () => {
    const error = buildAxiosError(400, { message: { nested: 'object' }, error: 'BadRequest' });

    filter.catch(error, buildHost({ status, json }));

    const body = json.mock.calls[0][0] as Record<string, unknown>;
    expect(typeof body['message']).toBe('string');
    expect(body['message']).toBe('Service error');
  });
});
