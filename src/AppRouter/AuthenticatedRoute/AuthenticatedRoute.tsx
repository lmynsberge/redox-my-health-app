import { Spin } from 'antd';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { user } from '../../contexts';
import { routes } from '../routes';

export const AuthenticatedRoute: React.FC<RouteProps> = (props: RouteProps) => {
  const state = user.useUserState();

  if (state.authStatus === 'initializing') {
    return (
      <Spin>
        <div></div>
      </Spin>
    );
  }

  return state.authStatus === 'loggedIn' ? (
    <Route {...props} />
  ) : (
    <Redirect to={routes.login.root.create()} />
  );
};
