export const handleResponse = response => {

  if (response.status === 204) {
    return null;
  }

  return response.text().then(text => {
    let error;
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
        error = data.error;
      } catch { }
    }
    if (!response.ok) {
      // console.log(error)
      return Promise.reject(error ? `${response.statusText} ${JSON.stringify(error, null, 4)}` : ` ${response.statusText}`);
    }
    return data;
  });
};

export const handleFetchError = e => {
  if (e instanceof TypeError) {
    return Promise.reject("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
  }
  console.error("handleFetchError", e);
  throw e;
};