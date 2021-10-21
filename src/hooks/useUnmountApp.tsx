import { user } from '../contexts';
import React from 'react';

export const useUnmountApp = () => {
  const [isUnmounted, setIsUnmounted] = React.useState(false);

  const userDispatch = user.useUserDispatch();

  const unmountApp = React.useCallback(async () => {
    await user.logoutUser(userDispatch);

    setIsUnmounted(true);
  }, [userDispatch]);

  return {
    unmountApp,
    isUnmounted,
  };
};
