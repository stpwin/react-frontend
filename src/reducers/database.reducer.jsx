import { databaseConstants } from "../constants";

export const database = (state = {}, action) => {
  switch (action.type) {
    case databaseConstants.SET_COUNTER_REQUEST:
      return {
        loading: true
      };
    case databaseConstants.SET_COUNTER_SUCCESS:
      return { result: action.data };
    case databaseConstants.SET_COUNTER_FAILURE:
      return {
        error: action.error
      };

    case databaseConstants.GET_ALL_COUNTER_REQUEST:
      return {
        loading: true
      };
    case databaseConstants.GET_ALL_COUNTER_SUCCESS:
      return { counters: action.data };
    case databaseConstants.GET_ALL_COUNTER_FAILURE:
      return {
        error: action.error
      };

    case databaseConstants.GET_INFO_REQUEST:
      return {
        loading: true
      };
    case databaseConstants.GET_INFO_SUCCESS:
      return { info: action.data };
    case databaseConstants.GET_INFO_FAILURE:
      return {
        error: action.error
      };

    case databaseConstants.GET_VERIFY_INFO_REQUEST:
      return {
        loading: true
      };
    case databaseConstants.GET_VERIFY_INFO_SUCCESS:
      return { info: action.data };
    case databaseConstants.GET_VERIFY_INFO_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
};
