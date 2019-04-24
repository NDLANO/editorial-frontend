import defined from 'defined';

export function createErrorPayload(status, messages, json) {
  throw Object.assign(new Error(''), { status, json, messages }); // TODO: should be fixed in future
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

    res
      .json()
      .then(json => {
        // console.log(json);
        reject(
          createErrorPayload(
            res.status,
            defined(json.messages, res.statusText),
            json,
          ),
        );
      })
      .catch(reject);
  });
}
