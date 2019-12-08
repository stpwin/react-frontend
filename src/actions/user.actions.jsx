import { userConstants } from "../constants";
import { userService } from "../services";
import { alertActions } from "./";
import { history } from "../helpers";

const login = (username, password) => {
  return dispatch => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      user => {
        dispatch(success(user));
        history.push("/");
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
};

const logout = () => {
  userService.logout();
  return { type: userConstants.LOGOUT };
};

const getAll = (page, pages) => {
  return dispatch => {
    dispatch(request());

    userService.getAll(page, pages).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(data) {
    return { type: userConstants.GETALL_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error };
  }
};

const getFilter = (filter, page, pages) => {
  return dispatch => {
    dispatch(request());

    userService.getFilter(filter, page, pages).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: userConstants.GETFILTER_REQUEST };
  }
  function success(data) {
    return { type: userConstants.GETFILTER_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GETFILTER_FAILURE, error };
  }
};

export const userActions = {
  login,
  logout,
  getAll,
  getFilter
};
