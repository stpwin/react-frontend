import { customerConstants } from "../constants";

export const customers = (state = {}, action) => {
  switch (action.type) {
    case customerConstants.CREATE_REQUEST:
      return {
        loading: true
      };
    case customerConstants.CREATE_SUCCESS:
      return action.data;
    case customerConstants.CREATE_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.GET_REQUEST:
      return {
        loading: true
      };
    case customerConstants.GET_SUCCESS:
      return { customer: action.data };
    case customerConstants.GET_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.GET_BY_SEQUENCE_REQUEST:
      return {
        filterLoading: true
      };
    case customerConstants.GET_BY_SEQUENCE_SUCCESS:
      return { customers: action.data };
    case customerConstants.GET_BY_SEQUENCE_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.GET_ALL_REQUEST:
      return {
        loading: true
      };
    case customerConstants.GET_ALL_SUCCESS:
      return { customers: action.data };
    case customerConstants.GET_ALL_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.GET_FILTER_REQUEST:
      return {
        filterLoading: true
      };
    case customerConstants.GET_FILTER_SUCCESS:
      return { customers: action.data };
    case customerConstants.GET_FILTER_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.UPDATE_REQUEST:
      return {
        loading: true
      };
    case customerConstants.UPDATE_SUCCESS:
      return action.data;
    case customerConstants.UPDATE_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.VERIFY_REQUEST:
      return {
        loading: true
      };
    case customerConstants.VERIFY_SUCCESS:
      return action.data;
    case customerConstants.VERIFY_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.REMOVE_REQUEST:
      return {
        loading: true
      };
    case customerConstants.REMOVE_SUCCESS:
      return action.data;
    case customerConstants.REMOVE_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.GET_SIGNATURE_REQUEST:
      return {
        loading: true
      };
    case customerConstants.GET_SIGNATURE_SUCCESS:
      return { signature: action.data };
    case customerConstants.GET_SIGNATURE_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.APPROVE_REQUEST:
      return {
        loading: true
      };
    case customerConstants.APPROVE_SUCCESS:
      return { approve: action.data };
    case customerConstants.APPROVE_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.REVOKE_APPROVE_REQUEST:
      return {
        loading: true
      };
    case customerConstants.REVOKE_APPROVE_SUCCESS:
      return { approve: action.data };
    case customerConstants.REVOKE_APPROVE_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.SET_VERIFY_REQUEST:
      return {
        loading: true
      };
    case customerConstants.SET_VERIFY_SUCCESS:
      return { verify: action.data };
    case customerConstants.SET_VERIFY_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.REMOVE_VERIFY_REQUEST:
      return {
        loading: true
      };
    case customerConstants.REMOVE_VERIFY_SUCCESS:
      return { verify: action.data };
    case customerConstants.REMOVE_VERIFY_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
};
