import { databaseConstants } from "../constants";
import { databaseService } from "../services";

const set = (name, sequence) => {
  return dispatch => {
    dispatch(request());

    databaseService.set(name, sequence).then(
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

// const reset = name => {
//   return dispatch => {
//     dispatch(request());

//     databaseService.reset(name).then(
//       data => dispatch(success(data)),
//       error => dispatch(failure(error))
//     );
//   };

//   function request() {
//     return { type: databaseConstants.RESET_COUNTER_REQUEST };
//   }
//   function success(data) {
//     return { type: databaseConstants.RESET_COUNTER_SUCCESS, data };
//   }
//   function failure(error) {
//     return { type: databaseConstants.RESET_COUNTER_FAILURE, error };
//   }
// };

export const databaseActions = {
  set
  //   reset
};
