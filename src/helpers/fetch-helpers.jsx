export function handleFetchError(rep) {
  if (!rep) return;
  if (!rep.ok) {
    return rep.text().then(err => {
      throw err;
    });
  }
  return rep;
}
