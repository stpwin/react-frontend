import { databaseConstants } from "../constants";
import { databaseService } from "../services";

const getAllCounter = () => {
  return dispatch => {
    dispatch(request());

    databaseService.getAllCounter().then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: databaseConstants.GET_ALL_COUNTER_REQUEST };
  }
  function success(data) {
    return { type: databaseConstants.GET_ALL_COUNTER_SUCCESS, data };
  }
  function failure(error) {
    return { type: databaseConstants.GET_ALL_COUNTER_FAILURE, error };
  }
};

const setCounter = (name, sequence) => {
  return dispatch => {
    dispatch(request());

    databaseService.setCounter(name, sequence).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: databaseConstants.SET_COUNTER_REQUEST };
  }
  function success(data) {
    return { type: databaseConstants.SET_COUNTER_SUCCESS, data };
  }
  function failure(error) {
    return { type: databaseConstants.SET_COUNTER_FAILURE, error };
  }
};

const getInfo = () => {
  return dispatch => {
    dispatch(request());

    databaseService.getInfo().then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: databaseConstants.GET_INFO_REQUEST };
  }
  function success(data) {
    return { type: databaseConstants.GET_INFO_SUCCESS, data };
  }
  function failure(error) {
    return { type: databaseConstants.GET_INFO_FAILURE, error };
  }
};

const getVerifyInfoByDate = date => {
  return dispatch => {
    dispatch(request());

    databaseService.getVerifyInfoByDate(date).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: databaseConstants.GET_VERIFY_INFO_REQUEST };
  }
  function success(data) {
    return { type: databaseConstants.GET_VERIFY_INFO_SUCCESS, data };
  }
  function failure(error) {
    return { type: databaseConstants.GET_VERIFY_INFO_FAILURE, error };
  }
};

export const databaseActions = {
  getAllCounter,
  setCounter,
  getInfo,
  getVerifyInfoByDate
};
