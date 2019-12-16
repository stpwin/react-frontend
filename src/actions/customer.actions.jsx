import { customerConstants } from "../constants";
import { customerService } from "../services";
// import { alertActions } from "./";
// import { history } from "../helpers";

const create = customer => {
  return dispatch => {
    dispatch(request());

    customerService.create(customer).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.CREATE_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.CREATE_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.CREATE_FAILURE, error };
  }
};

const get = peaId => {
  return dispatch => {
    dispatch(request());

    customerService.get(peaId).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.GET_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.GET_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.GET_FAILURE, error };
  }
};

const getAll = (page, pages, war = "-") => {
  return dispatch => {
    dispatch(request());

    customerService.getAll(page, pages, war).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.GET_ALL_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.GET_ALL_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.GET_ALL_FAILURE, error };
  }
};

const getFilter = (filter, page, pages, war = "-") => {
  return dispatch => {
    dispatch(request());

    customerService.getFilter(filter, page, pages, war).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.GET_FILTER_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.GET_FILTER_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.GET_FILTER_FAILURE, error };
  }
};

const update = customer => {
  return dispatch => {
    dispatch(request());

    customerService.update(customer).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.UPDATE_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.UPDATE_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.UPDATE_FAILURE, error };
  }
};

const verify = (peaId, verify) => {
  return dispatch => {
    dispatch(request());

    customerService.verify(peaId, verify).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.VERIFY_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.VERIFY_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.VERIFY_FAILURE, error };
  }
};

const remove = peaId => {
  return dispatch => {
    dispatch(request());

    customerService.remove(peaId).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.REMOVE_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.REMOVE_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.REMOVE_FAILURE, error };
  }
};

export const customerActions = {
  create,
  get,
  getAll,
  getFilter,
  update,
  verify,
  remove
};
