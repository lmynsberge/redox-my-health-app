import {
  LOGIN_FAILED,
  LOGIN_SUCCEEDED,
  LOGOUT,
  UserActions,
  USER_DATA_RECEIVED,
} from './actions';
import { IUserState } from './user';
import { User } from '../../services/user';

export const reducer = (state: IUserState, action: UserActions): IUserState => {
  switch (action.type) {
    case LOGOUT:
      return {
        user: {} as User,
        authStatus: 'loggedOut',
        error: undefined,
      };
    case LOGIN_SUCCEEDED: {
      console.log('login succeeded');
      const { user } = action.payload;

      return {
        ...state,
        user,
        authStatus: 'loggedIn',
        error: undefined,
      };
    }
    case USER_DATA_RECEIVED: {
      const { user } = action.payload;

      return {
        ...state,
        user,
      };
    }
    case LOGIN_FAILED: {
      const { e } = action.payload;

      return {
        ...state,
        authStatus: 'error',
        error: e,
      };
    }
    default:
      return ((_: never): never => {
        throw new Error(`Reducer is not exhaustive`);
      })(action);
  }
};
