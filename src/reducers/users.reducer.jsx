import { userConstants } from "../constants";

export const users = (state = {}, action) => {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      // console.log("GETALL_SUCCESS", action);
      return action.data;
    case userConstants.GETALL_FAILURE:
      return {
        error: action.error
      };
    case userConstants.GETFILTER_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETFILTER_SUCCESS:
      return action.data;
    case userConstants.GETFILTER_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
};
