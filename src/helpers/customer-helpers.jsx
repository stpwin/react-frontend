import { authHeader } from "./auth-header";
import { handleFetchError, handleFetchSuccessResponse } from "./fetch-helpers";
import { b64toBlob } from "./utils";
import config from "../config";

export const getCustomerByPeaId = peaId => {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/customers/peaid/${peaId}`, requestOptions)
    .then(handleFetchError)
    .then(({ err, rep }) => {
      if (err) {
        return null;
      }
      return rep;
    });
};

export const verifyCustomer = (peaId, appearDate, privilegeDate, sigData) => {
  const signatureData = sigData.replace("data:image/png;base64,", "");
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
  ).then(handleFetchSuccessResponse);
};

export const addCustomer = (
  title,
  firstName,
  lastName,
  peaId,
  authorize,
  soldierNo,
  war,
  houseNo,
  mooNo,
  districtNo
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({
      customer: {
        title,
        firstName,
        lastName,
        peaId,
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

  return fetch(`${config.apiUrl}/api/customers`, requestOptions);
};
