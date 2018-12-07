import defined from 'defined';

export function createErrorPayload(status, message, json) {
  return Object.assign(new Error(message), { status, json });
}

export function resolveJsonOrRejectWithError(res, taxonomy = false) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      if (res.status === 204) {
        return taxonomy ? resolve(true) : resolve();
      }
      // Temporary until API changes to return representation
      const location = res.headers.get('Location');
      if (res.status === 201 && (location || taxonomy)) {
        if (!location && taxonomy) {
          resolve();
        }
        return resolve(location);
      }
      return resolve(res.json());
    }
    return res
      .json()
      .then(json =>
        reject(
          createErrorPayload(
            res.status,
            defined(json.message, res.statusText),
            json,
          ),
        ),
      )
      .catch(reject);
  });
}
