import { userConstants } from "../constants";

export const users = (state = {}, action) => {
  switch (action.type) {
    case userConstants.CREATE_REQUEST:
      return {
        loading: true
      };
    case userConstants.CREATE_SUCCESS:
      return { data: action.data };
    case userConstants.CREATE_FAILURE:
      return {
        error: action.error
      };

    case userConstants.GET_REQUEST:
      return {
        loading: true
      };
    case userConstants.GET_SUCCESS:
      return { data: action.data };
    case userConstants.GET_FAILURE:
      return {
        error: action.error
      };

    case userConstants.GET_ALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GET_ALL_SUCCESS:
      return { data: action.data };
    case userConstants.GET_ALL_FAILURE:
      return {
        error: action.error
      };
    case userConstants.GET_FILTER_REQUEST:
      return {
        filterLoading: true
      };
    case userConstants.GET_FILTER_SUCCESS:
      return { data: action.data };
    case userConstants.GET_FILTER_FAILURE:
      return {
        error: action.error
      };

    case userConstants.UPDATE_REQUEST:
      return {
        loading: true
      };
    case userConstants.UPDATE_SUCCESS:
      return { data: action.data };
    case userConstants.UPDATE_FAILURE:
      return {
        error: action.error
      };

    case userConstants.REMOVE_REQUEST:
      return {
        loading: true
      };
    case userConstants.REMOVE_SUCCESS:
      return { data: action.data };
    case userConstants.REMOVE_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
};
