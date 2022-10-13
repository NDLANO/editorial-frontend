/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

type NdlaErrorFields = {
  status: number;
  messages: string;
  json: any;
};

export type NdlaErrorPayload = NdlaErrorFields & Error;

export function isNdlaErrorPayload(err: any): err is NdlaErrorPayload {
  if (typeof err.status === 'number' && typeof err.messages === 'string') {
    if (err instanceof Error) {
      return true;
    }
  }
  return false;
}

function buildErrorPayload(status: number, messages: string, json: any): NdlaErrorPayload {
  return Object.assign({}, { status, json, messages }, new Error(''));
}

export function throwErrorPayload(status: number, messages: string, json: any) {
  throw buildErrorPayload(status, messages, json);
}

export const onError = (err: NdlaErrorPayload & { statusText?: string }) => {
  throwErrorPayload(err.status, err.message ?? err.statusText ?? '', err);
};

export const resolveLocation = (res: Response): Promise<string> => {
  return new Promise((resolve, reject) => {
    const location = res.headers.get('Location');
    if (res.status === 201 && location) {
      return resolve(location);
    }
    return reject(throwErrorPayload(res.status || -1, 'Location does not exist!', null));
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
        reject(throwErrorPayload(res.status, json.messages ?? res.statusText, json));
      })
      .catch(reject);
  });
};

export const resolveJsonOrVoidOrRejectWithError = <T>(res: Response): Promise<T | void> =>
  res.headers.get('content-type')?.includes('application/json')
    ? resolveJsonOrRejectWithError<T>(res)
    : resolveVoidOrRejectWithError(res);

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
        reject(
          throwErrorPayload(res.status, json.messages ?? json.description ?? res.statusText, json),
        );
      })
      .catch(reject);
  });
};
