import config from "../config";
import { authHeader } from "../helpers";

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
    });
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
  return fetch(`${config.apiUrl}/api/users`, requestOptions).then(
    handleResponse
  );
};

const get = uid => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/users/uid/${uid}`, requestOptions).then(
    handleResponse
  );
};

const getAll = (page, limit) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/users/all?page=${page}&limit=${limit}`,
    requestOptions
  ).then(handleResponse);
};

const getFilter = (filter, page, limit) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/users/filter/${filter}?page=${page}&limit=${limit}`,
    requestOptions
  ).then(handleResponse);
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

  return fetch(`${config.apiUrl}/api/users/${uid}`, requestOptions).then(
    handleResponse
  );
};

const remove = uid => {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
    body: JSON.stringify({
      uid
    })
  };

  return fetch(`${config.apiUrl}/api/users`, requestOptions).then(
    handleResponse
  );
};

const handleResponse = response => {

  if (response.status === 204) {
    return null;
  }

  return response.text().then(text => {
    let error;
    let data;
    if (text) {
      try {
        data = JSON.parse(text);
        error = data.error;
      } catch { }
    }
    if (!response.ok) {
      return Promise.reject((error && error.message) || response.statusText);
    }
    return data;
  });
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
