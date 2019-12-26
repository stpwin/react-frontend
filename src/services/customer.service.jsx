import config from "../config";
import {
  authHeader,
  b64toBlob,
  handleResponse,
  handleFetchError
} from "../helpers";
// import { Promise } from "q";

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
  if (!peaId) {
    return Promise.reject("peaId required");
  }
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

const getBySequence = (war, seq) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/customers/seq/${war}/${seq}`,
    requestOptions
  )
    .then(handleResponse)
    .catch(handleFetchError);
};

const update = (peaIdRef, {
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
  if (!peaId || !peaIdRef) {
    return Promise.reject("peaId required");
  }
  const requestOptions = {
    method: "PUT",
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

  return fetch(`${config.apiUrl}/api/customers/${peaIdRef}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const verify = (peaId, { appearDate, signature }) => {
  if (!peaId || !appearDate) {
    return Promise.reject("2 arguments required");
  }

  const formData = new FormData();

  if (signature) {
    const signatureData = signature.replace("data:image/png;base64,", "");
    const signatureBlob = b64toBlob(signatureData, "image/png");
    formData.append("signature", signatureBlob, "signature.png");
  }

  // formData.append("appearDate", JSON.stringify(appearDate));
  // console.log("appearDate", JSON.stringify(appearDate))
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), appearDate: JSON.stringify(appearDate) },
    body: formData
  };

  return fetch(`${config.apiUrl}/api/customers/verify/${peaId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const remove = peaId => {
  if (!peaId) {
    return Promise.reject("peaId required");
  }
  const requestOptions = {
    method: "DELETE",
    headers: authHeader()
  };
  return fetch(`${config.apiUrl}/api/customers/${peaId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);
};

const approve = (peaId, verifyId, approvedDate = new Date()) => {
  if (!peaId || !verifyId) {
    return Promise.resolve(null);
  }

  const requestOptions = {
    method: "PATCH",
    headers: { "Accept": "application/json", "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({
      approvedDate
    })
  };
  return fetch(`${config.apiUrl}/api/customers/approve/${peaId}/${verifyId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);

}

const revokeApprove = (peaId, verifyId) => {
  if (!peaId || !verifyId) {
    return Promise.resolve(null);
  }

  const requestOptions = {
    method: "PATCH",
    headers: { "Accept": "application/json", "Content-Type": "application/json", ...authHeader() },
  };
  return fetch(`${config.apiUrl}/api/customers/revoke_approve/${peaId}/${verifyId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);

}

const setVerify = (peaId, verifyId, state) => {
  if (!peaId || !verifyId) {
    return Promise.resolve(null);
  }

  const requestOptions = {
    method: "PATCH",
    headers: { "Accept": "application/json", "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({
      state
    })
  };
  return fetch(`${config.apiUrl}/api/customers/set_verify/${peaId}/${verifyId}`, requestOptions)
    .then(handleResponse)
    .catch(handleFetchError);

}

const getSignature = (peaId, sigId) => {
  if (!peaId || !sigId) {
    return Promise.resolve(null);
  }
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

export const customerService = {
  create,
  get,
  getAll,
  getFilter,
  getBySequence,
  update,
  verify,
  remove,
  getSignature,
  approve,
  revokeApprove,
  setVerify
};
