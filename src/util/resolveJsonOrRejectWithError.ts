import defined from 'defined';

export function createErrorPayload(status: number, messages: string, json: any) {
  throw Object.assign(new Error(''), { status, json, messages }); // TODO: should be fixed in future
}

export const resolveLocation = (res: Response): Promise<string> => {
  return new Promise((resolve, reject) => {
    const location = res.headers.get('Location');
    if (res.status === 201 && location) {
      return resolve(location);
    }
    return reject(createErrorPayload(-1, 'Location does not exist!', null));
  });
};

export interface ResolveOptions<T> {
  alternateResolve?: (
    res: Response,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
  ) => T;
}

export const resolveVoidOrRejectWithError = (res: Response): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return resolve();
    }
    return res
      .json()
      .then(json => {
        reject(createErrorPayload(res.status, defined(json.messages, res.statusText), json));
      })
      .catch(reject);
  });
};

export const resolveJsonOrRejectWithError = <T>(
  res: Response,
  { alternateResolve }: ResolveOptions<T> = {},
): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      if (alternateResolve) {
        const r = alternateResolve(res, resolve, reject);
        if (r) return r;
      }
      return resolve(res.json());
    }

    return res
      .json()
      .then(json => {
        reject(createErrorPayload(res.status, defined(json.messages, res.statusText), json));
      })
      .catch(reject);
  });
};
