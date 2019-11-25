import { userConstants } from "../constants";
import { userService } from "../services";
import { alertActions } from "./";
import { history } from "../store";

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

const create = user => {
  return dispatch => {
    dispatch(request());

    userService.create(user).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };
  function request() {
    return { type: userConstants.CREATE_REQUEST };
  }
  function success(data) {
    return { type: userConstants.CREATE_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.CREATE_FAILURE, error };
  }
};

const get = uid => {
  return dispatch => {
    dispatch(request());

    userService.get(uid).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };
  function request() {
    return { type: userConstants.GET_REQUEST };
  }
  function success(data) {
    return { type: userConstants.GET_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GET_FAILURE, error };
  }
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
    return { type: userConstants.GET_ALL_REQUEST };
  }
  function success(data) {
    return { type: userConstants.GET_ALL_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GET_ALL_FAILURE, error };
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
    return { type: userConstants.GET_FILTER_REQUEST };
  }
  function success(data) {
    return { type: userConstants.GET_FILTER_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GET_FILTER_FAILURE, error };
  }
};

const update = (uid, user) => {
  return dispatch => {
    dispatch(request());
    userService.update(uid, user).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };
  function request() {
    return { type: userConstants.UPDATE_REQUEST };
  }
  function success(data) {
    return { type: userConstants.UPDATE_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.UPDATE_FAILURE, error };
  }
};

const remove = uid => {
  return dispatch => {
    dispatch(request());

    userService.remove(uid).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: userConstants.REMOVE_REQUEST };
  }
  function success(data) {
    return { type: userConstants.REMOVE_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.REMOVE_FAILURE, error };
  }
};

export const userActions = {
  login,
  logout,
  create,
  get,
  getAll,
  getFilter,
  update,
  remove
};
