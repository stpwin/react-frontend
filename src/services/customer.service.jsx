import config from "../config";
import { authHeader, b64toBlob } from "../helpers";

const create = ({
  peaId,
  title,
  firstName,
  lastName,
  houseNo,
  mooNo,
  districtNo,
  authorize,
  soldierNo,
  war
}) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({
      customer: {
        peaId,
        title,
        firstName,
        lastName,
        authorize,
        soldierNo,
        war,
        address: {
          houseNo,
          mooNo,
          districtNo
        }
      }
    })
  };

  return fetch(`${config.apiUrl}/api/customers`, requestOptions).then(
    handleResponse
  );
};

const get = peaId => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/customers/peaid/${peaId}`,
    requestOptions
  ).then(handleResponse);
};

const getAll = (page, limit, war = "-") => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/customers/all?war=${war}&page=${page}&limit=${limit}`,
    requestOptions
  ).then(handleResponse);
};

const getFilter = (filter, page, limit, war = "-") => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/customers/filter/${filter}?war=${war}&page=${page}&limit=${limit}`,
    requestOptions
  ).then(handleResponse);
};

const update = ({
  peaId,
  title,
  firstName,
  lastName,
  houseNo,
  mooNo,
  districtNo,
  authorize,
  soldierNo,
  war
}) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({
      customer: {
        title,
        firstName,
        lastName,
        authorize,
        soldierNo,
        war,
        address: {
          houseNo,
          mooNo,
          districtNo
        }
      }
    })
  };

  return fetch(`${config.apiUrl}/api/customers/${peaId}`, requestOptions).then(
    handleResponse
  );
};

const verify = (peaId, { appearDate, privilegeDate, signature }) => {
  const signatureData = signature.replace("data:image/png;base64,", "");
  const signatureBlob = b64toBlob(signatureData, "image/png");
  const formData = new FormData();

  formData.append("appearDate", JSON.stringify(appearDate));
  formData.append("privilegeDate", JSON.stringify(privilegeDate));
  formData.append("signature", signatureBlob, "signature.png");

  const requestOptions = {
    method: "PUT",
    headers: authHeader(),
    body: formData
  };

  return fetch(
    `${config.apiUrl}/api/customers/verify/${peaId}`,
    requestOptions
  ).then(handleResponse);
};

const remove = peaId => {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader()
  };
  return fetch(`${config.apiUrl}/api/customers/${peaId}`, requestOptions).then(
    handleResponse
  );
};

const handleResponse = response => {
  if (response.status === 204) {
    return null;
  }
  return response.text().then(text => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Unauthorize.");
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
};

export const customerService = {
  create,
  get,
  getAll,
  getFilter,
  update,
  verify,
  remove
};
