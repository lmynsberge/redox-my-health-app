import { User } from '../../services/user';

export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED' as const;
export const loginSucceeded = (user: User) => ({
  type: LOGIN_SUCCEEDED,
  payload: { user },
});

export const LOGOUT = 'LOGOUT' as const;
export const logout = () => ({
  type: LOGOUT,
});

export const USER_DATA_RECEIVED = 'USER_DATA_RECEIVED' as const;
export const userDataReceived = (user: User) => ({
  type: USER_DATA_RECEIVED,
  payload: { user },
});

export const LOGIN_FAILED = 'LOGIN_FAILED' as const;
export const loginFailed = (e: Error | unknown) => ({
  type: LOGIN_FAILED,
  payload: { e: e instanceof Error ? e : new Error((e as any)?.toString()) },
});

/*
 * All actions
 */
export type UserActions =
  | ReturnType<typeof loginSucceeded>
  | ReturnType<typeof logout>
  | ReturnType<typeof userDataReceived>
  | ReturnType<typeof loginFailed>;
