/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FetchResponse } from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";

type NdlaErrorFields = {
  status: number;
  messages: string;
  json: any;
};

export type NdlaErrorPayload = NdlaErrorFields & Error;

export class NdlaApiError extends Error {
  status: number;
  messages: string;
  json: any;
  constructor({ status, messages, json }: NdlaErrorFields) {
    super("");
    this.status = status;
    this.messages = messages;
    this.json = json;
  }
}

export function isNotFoundError(err: any): err is NdlaApiError {
  return err instanceof NdlaApiError && err.status === 404;
}

export function isNdlaApiError(err: any): err is NdlaErrorPayload {
  return err instanceof NdlaApiError;
}

function buildErrorPayload(status: number, messages: string, json: any): NdlaErrorPayload {
  return new NdlaApiError({ status, json, messages });
}

export function throwErrorPayload(status: number, messages: string, json: any) {
  throw buildErrorPayload(status, messages, json);
}

export const onError = (err: NdlaErrorPayload & { statusText?: string }) => {
  throwErrorPayload(err.status, err.message ?? err.statusText ?? "", err);
};

export const resolveLocation = (res: Response): Promise<string> => {
  return new Promise((resolve, reject) => {
    const location = res.headers.get("Location");
    if (res.status === 201 && location) {
      return resolve(location);
    }
    return reject(throwErrorPayload(res.status || -1, "Location does not exist!", null));
  });
};

export interface ResolveOptions<T> {
  alternateResolve?: (res: Response, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => T;
}

export const resolveVoidOrRejectWithError = (res: Response): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return resolve();
    }
    return res
      .json()
      .then((json) => {
        reject(throwErrorPayload(res.status, json.messages ?? res.statusText, json));
      })
      .catch(reject);
  });
};

export const resolveJsonOrVoidOrRejectWithError = <T>(res: Response): Promise<T | void> =>
  res.headers.get("content-type")?.includes("application/json")
    ? resolveJsonOrRejectWithError<T>(res)
    : resolveVoidOrRejectWithError(res);

const getErrorMessages = (err: unknown): string | undefined => {
  if (!err || typeof err !== "object") return;
  if ("messages" in err && typeof err.messages === "string") return err.messages;
  if ("description" in err && typeof err.description === "string") return err.description;
};

export const resolveOATS = async <A extends Record<string | number, any>, B, C extends MediaType>(
  res: FetchResponse<A, B, C>,
) => {
  const { data, response, error } = res;
  if (response.ok) return data;
  const messages = getErrorMessages(error) ?? response.statusText;
  throw buildErrorPayload(response.status, messages, error);
};

/** Resolves a response from OpenApi-TS fetch client and asserts that the response is successful */
export const resolveJsonOATS = async <A extends Record<string | number, any>, B, C extends MediaType>(
  res: FetchResponse<A, B, C>,
) => {
  const { data, response, error } = res;
  if (response.ok && data) return data;
  const messages = getErrorMessages(error) ?? response.statusText;
  throw buildErrorPayload(response.status, messages, error);
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
      .then((json) => {
        reject(throwErrorPayload(res.status, json.messages ?? json.description ?? res.statusText, json));
      })
      .catch(reject);
  });
};

export const resolveTextOrRejectWithError = (res: Response): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return resolve(res.text());
    }

    return res
      .text()
      .then((txt) => reject(throwErrorPayload(res.status, txt, undefined)))
      .catch(reject);
  });
};
