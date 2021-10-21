import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { Redirect, RedirectProps } from 'react-router-dom';

import { appConfig } from '../../appConfig';
import { user } from '../../contexts';
import { useComponentMounted } from '../../hooks';

const { loginUser, useUserDispatch, useUserState } = user;

export const LoginPage: React.FC<RedirectProps> = (props) => {
  const { authStatus, error } = useUserState();
  const dispatch = useUserDispatch();
  const mounted = useComponentMounted();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      await loginUser(
        { username: values.email, password: values.password },
        dispatch
      );
    } catch (e) {}
  };

  // If coming from somewhere, redirect to there once logged in. Otherwise, redirect
  // to the root route '/'
  const from = props.from || { pathname: '/' };

  if (authStatus === 'initializing') {
    return (
      <Spin>
        <div></div>
      </Spin>
    );
  }

  if (authStatus === 'loggedIn') {
    return <Redirect to={from} />;
  }

  const initialValues = { email: '', password: '' };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '90vh' }}>
      <Col>
        <Card
          title="Login"
          style={{ width: '400px' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Row gutter={[16, 20]}>
            <Col span={24}>
              <Alert
                showIcon
                type="info"
                message="Credentials are the same as the Redox Dashboard."
              />
            </Col>
            <Col span={24}>
              <Form
                initialValues={initialValues}
                onFinish={async (values) => {
                  setIsSubmitting(true);
                  try {
                    await handleSubmit(values);
                  } finally {
                    if (mounted.current) {
                      setIsSubmitting(false);
                    }
                  }
                }}
              >
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Username is required.' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Username..."
                    autoComplete="username"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Password is required.' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password..."
                    autoComplete="current-password"
                  />
                </Form.Item>
                {error && <span>Failed to log in</span>}
                <Form.Item noStyle>
                  <Row align="middle">
                    <Col span={12}>
                      <div>
                        <a
                          href={`${appConfig.DASHBOARD_URL}/auth/password/reset-request`}
                          rel="noopener noreferrer"
                          target="_redox_customer_dash"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        icon={<LoginOutlined />}
                      >
                        Login
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
