import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { DateTime } from 'luxon';
import * as uuid from 'uuid';

import { AuditService } from '../audit';

const baseInstance = axios.create({
  timeout: 30000,
  responseType: 'json',
  transformResponse: [
    (data, headers) => {
      if (!headers) {
        headers = {};
      }
      headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';

      return data;
    },
  ],
});

interface RequestMeta {
  meta?: {
    requestStartedAt?: DateTime;
  };
}

baseInstance.interceptors.request.use(
  (req: AxiosRequestConfig & RequestMeta) => {
    req.meta = req.meta || {};
    req.meta.requestStartedAt = DateTime.utc();
    return req;
  }
);

// Add a response interceptor for auditing
baseInstance.interceptors.response.use(
  (response) => {
    try {
      const responseBody = JSON.parse(response.data);
      (response as any).data = responseBody;
    } catch (err) {
      // Do nothing, probably not JSON
    }
    try {
      if (response.config.data) {
        const requestBody = JSON.parse(response.config.data);
        (response as any).config.data = requestBody;
      }
    } catch (err) {
      // Do nothing, probably not JSON
    }

    AuditService.addAuditItem({
      id: uuid.v4(),
      at: DateTime.utc(),
      type: 'http',
      version: '1.0.0',
      data: {
        url: response.config.url || response.config.baseURL || '',
        method: response.config.method || 'GET',
        requestHeaders: response.config.headers || {},
        responseHeaders: response.headers,
        responseStatusCode: response.status,
        requestBody: response.config.data,
        responseBody: response.data,
        timing:
          ((response.config as RequestMeta).meta?.requestStartedAt
            ?.diffNow()
            .toMillis() || 0) * -1,
      },
    });
    return response;
  },
  (error) => {
    const { response }: { response: AxiosResponse } = error;

    try {
      const responseBody = JSON.parse(response?.data);
      (response as any).data = responseBody;
    } catch (err) {
      // Do nothing, probably not JSON
    }
    try {
      if (response.config.data) {
        const requestBody = JSON.parse(response?.config.data);
        (response as any).config.data = requestBody;
      }
    } catch (err) {
      // Do nothing, probably not JSON
    }

    AuditService.addAuditItem({
      id: uuid.v4(),
      at: DateTime.utc(),
      type: 'http',
      version: '1.0.0',
      data: {
        url: response?.config.url || response?.config.baseURL || '',
        method: response?.config.method || 'UNKNOWN',
        requestHeaders: response?.config.headers || {},
        responseHeaders: response?.headers || {},
        responseStatusCode: response?.status || error.name || 'Unknown',
        requestBody: response?.config.data,
        responseBody: response?.data,
        timing:
          ((response?.config as RequestMeta)?.meta?.requestStartedAt
            ?.diffNow()
            .toMillis() || 0) * -1,
      },
    });
    return Promise.reject(error);
  }
);

export const httpClient = baseInstance;
