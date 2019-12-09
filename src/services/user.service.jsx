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

const getAll = (page, limit) => {
  // console.log("page:", page);
  // console.log("limit:", limit);
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
  // console.log("filter:", filter);
  // console.log("page:", page);
  // console.log("limit:", limit);
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/users/filter/${filter}?page=${page}&limit=${limit}`,
    requestOptions
  ).then(handleResponse);
};

const handleResponse = response => {
  return response.text().then(text => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        // history.push("/login");
        // window.location.reload(true)
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    // console.log("handleResponse", data);
    return data;
  });
};

export const userService = {
  login,
  logout,
  getAll,
  getFilter
};
