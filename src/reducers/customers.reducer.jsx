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
      // console.log(action.data);
      return { customer: action.data };
    case customerConstants.GET_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.GET_ALL_REQUEST:
      return {
        loading: true
      };
    case customerConstants.GET_ALL_SUCCESS:
      return { data: action.data };
    case customerConstants.GET_ALL_FAILURE:
      return {
        error: action.error
      };

    case customerConstants.GET_FILTER_REQUEST:
      return {
        loading: true
      };
    case customerConstants.GET_FILTER_SUCCESS:
      return { data: action.data };
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

    default:
      return state;
  }
};
