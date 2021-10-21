import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Collapse, Descriptions, Tag } from 'antd';
import { get } from 'lodash';
import React from 'react';
import ReactJson from 'react-json-view';

import { AuditItem, AuditService } from '../services/audit';

const { Panel } = Collapse;

interface AdminPageProps {}

const panelHeader: React.FC<AuditItem> = (item) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {item.data.method.toUpperCase()} - {item.data.url}
      </div>
      <div>
        {item.data.responseStatusCode < 400 ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {item.data.responseStatusCode}
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {item.data.responseStatusCode}
          </Tag>
        )}
      </div>
    </div>
  );
};

export const AdminPage: React.FC<AdminPageProps> = () => {
  const [auditList, setAuditList] = React.useState<AuditItem[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const result = await AuditService.getAuditList('http');
        setAuditList(result.sort((a, b) => b.at.toMillis() - a.at.toMillis()));
      } catch (err) {
        console.error('Error while trying to fetch audit list.', err);
      }
    })();
  }, []);

  return (
    <Collapse bordered={false}>
      {auditList.map((item, index) => {
        return (
          <Panel header={panelHeader(item)} key={index}>
            <Descriptions title="API Info">
              <Descriptions.Item label="Method">
                {item.data.method.toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="URL">{item.data.url}</Descriptions.Item>
              <Descriptions.Item label="Received at">
                {item.at.toISO()}
              </Descriptions.Item>
              <Descriptions.Item label="Timing">
                {`${item.data.timing} ms`}
              </Descriptions.Item>
              <Descriptions.Item label="Status code">
                {item.data.responseStatusCode}
              </Descriptions.Item>
              <Descriptions.Item label="Dashboard link">
                <a
                  href={`https://dashboard.redoxengine.com/#/organization/5551/logs?logId=${get(
                    item.data.responseBody,
                    'Meta.Logs[0].ID'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {get(item.data.responseBody, 'Meta.Logs[0].ID', '') as string}
                </a>
              </Descriptions.Item>
            </Descriptions>
            <h4>Request - {item.data.requestHeaders['content-type']}</h4>
            {typeof item.data.requestBody === 'object' ? (
              <ReactJson src={item.data.requestBody || {}} collapsed />
            ) : (
              <div>{item.data.requestBody}</div>
            )}
            <h4>Response - {item.data.responseHeaders['content-type']}</h4>
            {typeof item.data.responseBody === 'object' ? (
              <ReactJson src={item.data.responseBody || {}} collapsed />
            ) : (
              <div>{item.data.responseBody}</div>
            )}
          </Panel>
        );
      })}
    </Collapse>
  );
};
