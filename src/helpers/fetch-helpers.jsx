export const handleFetchError = rep => {
  // console.log(rep.status);
  if (!rep.ok) {
    return rep.text().then(err => {
      return Promise.resolve({ err, rep: null });
    });
  }

  if (rep.status === 200) {
    return rep.json().then(res => {
      // console.log(res);
      return Promise.resolve({ err: null, rep: res });
    });
  }

  return Promise.resolve({ err: null, rep: null });
};

export const handleFetchSuccessResponse = rep => {
  // console.log(rep.status);
  if (!rep.ok) {
    return rep.text().then(err => {
      return Promise.resolve({ err, rep: null });
    });
  }

  if (rep.status === 200) {
    return Promise.resolve({ err: null, rep });
  }

  return Promise.resolve({ err: null, rep: null });
};

// export const getCustomerByPeaId = peaId => {
//   const reqConf = {
//     method: "GET",
//     headers: authHeader()
//   };

//   return fetch(`${config.apiUrl}/api/customers/peaid/${peaId}`, reqConf)
//     .then(this.handleFetchError)
//     .then(({ err, result }) => {
//       return result;
//     });
// };
