import axios, { type AxiosInstance } from 'axios';

import { getAccessToken } from '../auth/authToken';
import { apiBaseUrl } from '../config/env';

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: apiBaseUrl });

    /**
     * Attaches the access token to every outgoing request as
     * `Authorization: Bearer <access_token>`, so individual API methods never
     * deal with tokens.
     *
     * Token acquisition, caching and refresh are the registered provider's
     * responsibility (see `src/auth/authToken.ts`). There is no provider yet,
     * so today this resolves to `undefined` and requests are sent
     * unauthenticated; expect `401` from any non-`@Public()` backend route.
     */
    this.axiosInstance.interceptors.request.use(async (config) => {
      // Only transient provider failures should reach the catch below (network
      // error, identity-provider 5xx, throttling). Send the request
      // unauthenticated in that case and let the backend guard answer 401.
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch {
        console.warn(
          'Access token lookup failed; sending request unauthenticated',
        );
      }

      return config;
    });
  }

  public async getHello(): Promise<string> {
    return this.get('/api') as Promise<string>;
  }

  private async get(path: string): Promise<unknown> {
    return this.axiosInstance.get(path).then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .post(path, body)
      .then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .patch(path, body)
      .then((response) => response.data);
  }

  private async delete(path: string): Promise<unknown> {
    return this.axiosInstance.delete(path).then((response) => response.data);
  }
}

export default new ApiClient();
