import { authHeader, handleResponse, handleFetchError } from "../helpers";
import config from "../config";

const set = (name, sequence) => {
  const requestOption = {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({
      name,
      sequence
    })
  };

  return fetch(`${config.apiUrl}/api/database/counter/set`, requestOption)
    .then(handleResponse)
    .catch(handleFetchError);
};

// const reset = name => {
//   const requestOption = {
//     method: "PUT",
//     headers: authHeader(),
//     body: JSON.stringify({
//       name
//     })
//   };

//   return fetch(`${config.apiUrl}/api/database/counter/reset`, requestOption)
//     .then(handleResponse)
//     .catch(handleFetchError);
// };

export const databaseService = {
  set
  //   reset
};
