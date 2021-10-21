import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { User, UserService } from '../../services/user';
import * as UserActions from './actions';
import { reducer } from './reducer';

/*
 * User State
 */
export interface IUserState {
  user: User;
  authStatus: 'initializing' | 'loggedIn' | 'loggedOut' | 'error';
  error?: Error;
}

export type UserDispatch = Dispatch<UserActions.UserActions>;
export interface IUserStateAndDispatch {
  state: IUserState;
  dispatch: UserDispatch;
}

const initialState: IUserState = {
  user: {} as User,
  authStatus: 'initializing',
  error: undefined,
};

// Separate out State from Dispatch as recommended here:
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
const UserStateContext = createContext<IUserState>(initialState);
const UserDispatchContext = createContext<UserDispatch | undefined>(undefined);

UserStateContext.displayName = 'UserState';

const UserContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const setUserData = async () => {
      console.log('setting user data');
      try {
        await initUser(dispatch);
      } catch {
      } finally {
      }
    };
    setUserData();
  }, []);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {props.children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

const useUserState = () => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error(
      'userStateContext must be used within a UserContextProvider'
    );
  }
  return context;
};

const useUserDispatch = () => {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error(
      'userDispatchContext must be used within a UserContextProvider'
    );
  }
  return context;
};

// *** Dispatch Helpers *** //

const loginUser = async (
  payload: {
    username: string;
    password: string;
  },
  dispatch: UserDispatch
) => {
  try {
    const data = await UserService.login(payload.username, payload.password);
    dispatch(UserActions.loginSucceeded(data));
  } catch (e) {
    dispatch(UserActions.loginFailed(e));
  }
};

const initUser = async (dispatch: UserDispatch) => {
  try {
    const user = await UserService.check();
    dispatch(UserActions.loginSucceeded(user));
  } catch (e) {
    // If somehow the user is not logged in or became logged out, this will do that
    dispatch(UserActions.loginFailed(e));
  }
};

const logoutUser = async (dispatch: UserDispatch) => {
  try {
    await UserService.logout();
  } catch (e) {
    // Probably try again with a back-off
  } finally {
    dispatch(UserActions.logout());
  }
};

export {
  UserContextProvider,
  UserActions,
  initialState,
  useUserState,
  useUserDispatch,
  loginUser,
  logoutUser,
  initUser,
};
