import axios from '../../services/axios';
import {
  AUTH_FAIL, AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS, SET_AUTH_USER_DATA,
} from './types';

export const authStart = () => ({
  type: AUTH_START,
});

export const authSuccess = (token) => ({
  type: AUTH_SUCCESS,
  token,
});

export const authFail = (error) => ({
  type: AUTH_FAIL,
  error,
});

export const logout = () => {
  localStorage.removeItem('token');
  return {
    type: AUTH_LOGOUT,
  };
};

export const setAuthUserData = (data) => ({
  type: SET_AUTH_USER_DATA,
  data,
});

export const authCheckState = () => (dispatch) => {
  if (!localStorage.getItem('token')) { return; }

  axios.get('/user/profile')
    .then((response) => {
      dispatch(setAuthUserData(response.data));
    })
    .catch(() => {
      dispatch(logout());
    });
};

export const auth = (username, password) => (dispatch) => {
  dispatch(authStart());
  const authData = {
    username,
    password,
  };

  axios.post('/login', authData)
    .then((response) => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      dispatch(authSuccess(response.data.token));
      dispatch(authCheckState());
    })
    .catch((err) => {
      dispatch(authFail(err.response.data.message));
    });
};
