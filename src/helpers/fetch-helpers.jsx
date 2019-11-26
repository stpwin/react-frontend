export function handleFetchError(rep) {
  if (!rep.ok) {
    return rep.text().then(err => {
      throw err;
    });
  }
  return rep;
}
