import { routes } from '../../AppRouter/routes';
import { useUnmountApp } from '../../hooks/useUnmountApp';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export const LogoutPage: React.FC<{}> = () => {
  const { unmountApp, isUnmounted } = useUnmountApp();

  useEffect(() => {
    unmountApp();
  }, [unmountApp]);

  return <>{isUnmounted && <Redirect to={routes.login.root.create()} />}</>;
};
