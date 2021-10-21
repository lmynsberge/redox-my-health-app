import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AuthenticatedRoute } from './AuthenticatedRoute';
import { routes } from './routes';
import { LoginPage } from '../Auth/LoginPage';
import { LogoutPage } from '../Auth/LogoutPage';
import { MainPage } from '../Home';
import { PatientPage } from '../Patient';
import { AdminPage } from '../Admin';

export const AppRouter = () => {
  return (
    <>
      <Switch>
        <Route
          path={routes.login.root.template()}
          component={LoginPage}
        ></Route>
        <Route path={routes.logout.template()} component={LogoutPage}></Route>
        <AuthenticatedRoute path={routes.patient.root.template()}>
          <PatientPage />
        </AuthenticatedRoute>
        <AuthenticatedRoute path={routes.admin.root.template()}>
          <AdminPage />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/">
          <MainPage />
        </AuthenticatedRoute>
      </Switch>
    </>
  );
};
