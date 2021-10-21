import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Layout, Menu, Row, Space, Tag } from 'antd';
import React from 'react';
import { RiHospitalLine } from 'react-icons/ri';
import { Link, useHistory } from 'react-router-dom';

import { appConfig } from '../appConfig';
import { routes } from '../AppRouter/routes';
import { useUserState } from '../contexts/user';

export const Header: React.FC = () => {
  const history = useHistory();
  const user = useUserState();

  const env = 'Local' as 'Local' | 'Stage' | 'PRD';
  const envColorMap: { [key in typeof env]: string } = {
    Local: 'default',
    Stage: 'warning',
    PRD: '#cd201f',
  };
  const envNameMap: { [key in typeof env]: string } = {
    Local: 'local',
    Stage: 'stage',
    PRD: 'prod',
  };

  return (
    <Layout.Header
      className="header"
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Row>
        <Col>
          <Tag color={envColorMap[env]}>{envNameMap[env]}</Tag>
        </Col>
        <Col>
          <h1 style={{ color: 'white', paddingRight: '15px', margin: 0 }}>
            <span>R^My Health App</span>
          </h1>
        </Col>
      </Row>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['patient']}
        style={{
          flexGrow: 1,
        }}
      >
        <Menu.Item key="patient">
          <TeamOutlined />
          <Link to={routes.patient.search.create()}>Find Patient</Link>
        </Menu.Item>
        <Menu.SubMenu
          style={{ marginLeft: 'auto' }}
          title={
            <Space>
              <Avatar icon={<UserOutlined />} size="small" />
              <span className="header-user-name">{`${user.user.title} ${user.user.firstName}`}</span>
            </Space>
          }
          key="user"
        >
          <Menu.Item
            icon={<LogoutOutlined />}
            key="1"
            onClick={() => history.push(routes.logout.create())}
          >
            Logout
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3" icon={<RiHospitalLine className="anticon" />}>
            <Link to={routes.admin.api.root.create()}>API Audit</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<LockOutlined />}>
            <a
              href={`${appConfig.DASHBOARD_URL}/#/user/profile`}
              rel="noopener noreferrer"
              target="_redox_customer_dash"
            >
              Account Settings
            </a>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Layout.Header>
  );
};
