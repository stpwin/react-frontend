import { authHeader } from "./auth-header";
import { handleFetchError } from "./fetch-helpers";
import config from "../config";

export const getCustomerByPeaId = peaId => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/customers/peaid/${peaId}`, requestOptions)
    .then(handleFetchError)
    .then(rep => {
      if (rep.status === 200) {
        return rep.json();
      }
      return null;
    })
    .then(data => {
      // console.log(data);
      return data;
    });
};
