import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { AxiosRequestConfig } from 'axios';

export interface ForwardOptions {
  body?: unknown;
  query?: Record<string, string | string[]>;
  userId?: string;
  userRole?: string;
}

@Injectable()
export class ProxyService {
  constructor(private readonly http: HttpService) {}

  async forward<T>(
    method: string,
    url: string,
    options: ForwardOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {};
    if (options.userId) headers['x-user-id'] = options.userId;
    if (options.userRole) headers['x-user-role'] = options.userRole;

    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      ...(options.body !== undefined && { data: options.body }),
      ...(options.query && Object.keys(options.query).length > 0 && { params: options.query }),
    };

    const response = await firstValueFrom(this.http.request<T>(config));
    return response.data;
  }
}
