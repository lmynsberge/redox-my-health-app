import { DateTime } from 'luxon';

interface BaseAuditItem<
  T extends string,
  D extends Record<string, unknown> = {},
  V = '1.0.0'
> {
  id: string;
  type: T;
  version: V;
  data: D;
  at: DateTime;
}

export type AuditItem = BaseAuditItem<
  'http',
  {
    url: string;
    method: string;
    requestHeaders: Record<string, string>;
    responseHeaders: Record<string, string>;
    responseStatusCode: number;
    requestBody?: Record<string, unknown>;
    responseBody?: Record<string, unknown>;
    timing: number;
  }
>;

export const auditList: AuditItem[] = [];

export class AuditService {
  public static async addAuditItem(item: AuditItem): Promise<void> {
    auditList.push(item);
  }

  public static async getAuditList(type?: string): Promise<AuditItem[]> {
    return type ? auditList : auditList.filter((item) => item.type === 'http');
  }
}
