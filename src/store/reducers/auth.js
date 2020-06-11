import {
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_SUCCESS,
  SET_AUTH_USER_DATA,
} from '../actions/types';
import updateObject from '../utility';

const initialState = {
  token: null,
  error: null,
  user: null,
  loading: false,
  authRedirectPath: '/',
};

const authStart = (state) => updateObject(state, { error: null, loading: true });

const authSuccess = (state, action) => updateObject(state, {
  token: action.token,
  error: null,
  loading: false,
});

const authFail = (state, action) => updateObject(state, {
  error: action.error,
  loading: false,
});

const authLogout = (state) => updateObject(state, { token: null, userId: null });

const setUserData = (state, action) => updateObject(state, { user: action.data });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return authStart(state);
    case AUTH_SUCCESS:
      return authSuccess(state, action);
    case AUTH_FAIL:
      return authFail(state, action);
    case AUTH_LOGOUT:
      return authLogout(state);
    case SET_AUTH_USER_DATA:
      return setUserData(state, action);
    default:
      return state;
  }
};

export default reducer;
