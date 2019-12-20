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

  return fetch(`${config.apiUrl}/api/customers`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const get = peaId => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/customers/peaid/${peaId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const getAll = (page, limit, war = "-") => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/customers/all?war=${war}&page=${page}&limit=${limit}`,
    requestOptions
  )
    .then(handleResponse)
    .catch(handleFetchError);
};

const getFilter = (filter, page, limit, war = "-") => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/customers/filter/${filter}?war=${war}&page=${page}&limit=${limit}`,
    requestOptions
  )
    .then(handleResponse)
    .catch(handleFetchError);
};

const update = ({
  peaId,
  title,
  firstName,
  lastName,
  authorize,
  soldierNo,
  war,
  houseNo,
  mooNo,
  districtNo
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

  return fetch(`${config.apiUrl}/api/customers/${peaId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const verify = (peaId, { appearDate, signature }) => {
  const formData = new FormData();

  if (signature) {
    const signatureData = signature.replace("data:image/png;base64,", "");
    const signatureBlob = b64toBlob(signatureData, "image/png");
    formData.append("signature", signatureBlob, "signature.png");
  }

  formData.append("appearDate", JSON.stringify(appearDate));

  const requestOptions = {
    method: "PUT",
    headers: authHeader(),
    body: formData
  };

  return fetch(`${config.apiUrl}/api/customers/verify/${peaId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const remove = peaId => {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader()
  };
  return fetch(`${config.apiUrl}/api/customers/${peaId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const getSignature = (peaId, sigId) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/customers/signature/${peaId}/${sigId}`,
    requestOptions
  )
    .then(response => {
      if (response.status === 204) {
        return null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("Unauthorize.");
        }

        const error = response.statusText;
        return Promise.reject(error);
      }

      return response.arrayBuffer().then(data => {
        return { id: sigId, data };
      });
    })
    .catch(handleFetchError);
};

const handleResponse = response => {
  if (response.status === 204) {
    return null;
  }
  return response.text().then(text => {
    let error;
    if (text) {
      try {
        const data = JSON.parse(text);
        error = data.error;
        return data;
      } catch {}
    }
    if (!response.ok) {
      return Promise.reject(error || response.statusText);
    }
    return null;
  });
};

const handleFetchError = e => {
  if (e instanceof TypeError) {
    return Promise.reject("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
  }
  console.error(e);
  throw e;
};

export const customerService = {
  create,
  get,
  getAll,
  getFilter,
  update,
  verify,
  remove,
  getSignature
};
