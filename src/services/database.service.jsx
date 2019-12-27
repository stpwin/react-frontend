import { authHeader, handleResponse, handleFetchError } from "../helpers";
import config from "../config";

const getAllCounter = () => {
  const requestOption = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/settings/database/counters`, requestOption)
    .then(handleResponse)
    .catch(handleFetchError);
};

const setCounter = (name, sequence) => {
  const requestOption = {
    method: "PATCH",
    headers: { "Content-type": "application/json", ...authHeader() },
    body: JSON.stringify({
      name,
      sequence
    })
  };

  return fetch(`${config.apiUrl}/api/settings/database/counters`, requestOption)
    .then(handleResponse)
    .catch(handleFetchError);
};

const getInfo = () => {
  const requestOption = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/settings/database/info`, requestOption)
    .then(handleResponse)
    .catch(handleFetchError);
};

export const databaseService = {
  getAllCounter,
  setCounter,
  getInfo
};
