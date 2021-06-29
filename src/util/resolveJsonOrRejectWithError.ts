import defined from 'defined';

export function createErrorPayload(status: number, messages: string, json: any) {
  throw Object.assign(new Error(''), { status, json, messages }); // TODO: should be fixed in future
}

export function resolveJsonOrRejectWithError<T>(
  res: Response,
  options = { taxonomy: false, ignore403: false },
): Promise<T | boolean | string | undefined | object> {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      if (res.status === 204) {
        return options.taxonomy ? resolve(true) : resolve(undefined);
      }
      // Temporary until API changes to return representation
      const location = res.headers.get('Location');
      if (res.status === 201 && (location || options.taxonomy)) {
        if (!location && options.taxonomy) {
          resolve(undefined);
        }
        return resolve(location!);
      }
      return resolve(res.json());
    }

    // Needed when showing status for learningpaths without admin-access.
    if (res.status === 403 && options.ignore403) {
      return resolve({});
    }

    res
      .json()
      .then(json => {
        reject(createErrorPayload(res.status, defined(json.messages, res.statusText), json));
      })
      .catch(reject);
  });
}
