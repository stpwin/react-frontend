import { databaseConstants } from "../constants";

export const database = (state = {}, action) => {
  switch (action.type) {
    case databaseConstants.SET_COUNTER_REQUEST:
      return {
        loading: true
      };
    case databaseConstants.SET_COUNTER_SUCCESS:
      return { data: action.data };
    case databaseConstants.SET_COUNTER_FAILURE:
      return {
        error: action.error
      };

    // case databaseConstants.RESET_COUNTER_REQUEST:
    //   return {
    //     loading: true
    //   };
    // case databaseConstants.RESET_COUNTER_SUCCESS:
    //   return action.data;
    // case databaseConstants.RESET_COUNTER_FAILURE:
    //   return {
    //     error: action.error
    //   };

    default:
      return state;
  }
};
