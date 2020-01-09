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

const getBySequence = (war, seq) => {
  return dispatch => {
    dispatch(request());

    customerService.getBySequence(war, seq).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.GET_BY_SEQUENCE_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.GET_BY_SEQUENCE_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.GET_BY_SEQUENCE_FAILURE, error };
  }
};

const update = (peaId, customer) => {
  return dispatch => {
    dispatch(request());

    customerService.update(peaId, customer).then(
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

const getSignature = (peaId, sigId) => {
  return dispatch => {
    if (!peaId || !sigId) {
      return dispatch(success(null));
    }
    dispatch(request());

    customerService.getSignature(peaId, sigId).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.GET_SIGNATURE_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.GET_SIGNATURE_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.GET_SIGNATURE_FAILURE, error };
  }
};

const approve = (peaId, verifyId, approvedDate = new Date()) => {
  return dispatch => {
    if (!peaId || !verifyId) {
      return dispatch(success(null));
    }
    dispatch(request());

    customerService.approve(peaId, verifyId, approvedDate).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.APPROVE_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.APPROVE_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.APPROVE_FAILURE, error };
  }
};

const revokeApprove = (peaId, verifyId) => {
  return dispatch => {
    if (!peaId || !verifyId) {
      return dispatch(success(null));
    }
    dispatch(request());

    customerService.revokeApprove(peaId, verifyId).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.REVOKE_APPROVE_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.REVOKE_APPROVE_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.REVOKE_APPROVE_FAILURE, error };
  }
};

const setVerify = (peaId, verifyId, state) => {
  return dispatch => {
    if (!peaId || !verifyId || !state) {
      return dispatch(success(null));
    }
    dispatch(request());

    customerService.setVerify(peaId, verifyId, state).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.SET_VERIFY_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.SET_VERIFY_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.SET_VERIFY_FAILURE, error };
  }
};

const removeVerify = (peaId, verifyId) => {
  return dispatch => {
    if (!peaId || !verifyId) {
      return dispatch(success(null));
    }
    dispatch(request());

    customerService.removeVerify(peaId, verifyId).then(
      data => dispatch(success(data)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.REMOVE_VERIFY_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.REMOVE_VERIFY_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.REMOVE_VERIFY_FAILURE, error };
  }
};

const checkExists = peaId => {
  return dispatch => {
    dispatch(request());

    customerService.get(peaId).then(
      data => dispatch(success(data ? true : false)),
      error => dispatch(failure(error))
    );
  };

  function request() {
    return { type: customerConstants.CUSTOMER_EXISTS_REQUEST };
  }
  function success(data) {
    return { type: customerConstants.CUSTOMER_EXISTS_SUCCESS, data };
  }
  function failure(error) {
    return { type: customerConstants.CUSTOMER_EXISTS_FAILURE, error };
  }
};

export const customerActions = {
  create,
  get,
  getAll,
  getFilter,
  getBySequence,
  update,
  verify,
  remove,
  getSignature,
  approve,
  revokeApprove,
  setVerify,
  removeVerify,
  checkExists
};
