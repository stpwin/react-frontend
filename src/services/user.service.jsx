import config from "../config";
import { authHeader, handleResponse, handleFetchError } from "../helpers";

const login = (username, password) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { username: username, password: password } })
  };

  return fetch(`${config.apiUrl}/api/users/login`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    })
    .catch(handleFetchError);
};

const logout = () => {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
};

const create = ({ username, password, description, role, displayName }) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({
      username,
      password,
      description,
      role,
      displayName
    })
  };
  return fetch(`${config.apiUrl}/api/users`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const get = uid => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/users/uid/${uid}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const getAll = (page, limit) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/users/all?page=${page}&limit=${limit}`,
    requestOptions
  ).then(handleResponse)
    .catch(handleFetchError);
};

const getFilter = (filter, page, limit) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/users/filter/${filter}?page=${page}&limit=${limit}`,
    requestOptions
  ).then(handleResponse)
    .catch(handleFetchError);
};

const update = (
  uid,
  { username, displayName, description, role, password }
) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeader()
    },
    body: JSON.stringify({
      user: {
        username,
        displayName,
        description,
        role,
        password
      }
    })
  };

  return fetch(`${config.apiUrl}/api/users/${uid}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const remove = uid => {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/users/uid/${uid}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

export const userService = {
  login,
  logout,
  create,
  get,
  getAll,
  getFilter,
  update,
  remove
};
