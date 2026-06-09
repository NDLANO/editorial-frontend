/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { NextFunction, Request, Response } from "express";

interface CorrelationContext {
  correlationID: string;
}

const asyncLocalStorage = new AsyncLocalStorage<CorrelationContext>();

const getAsString = (value: unknown): string => (typeof value === "string" ? value : "");

/** Read an incoming `x-correlation-id` (or generate one) and stash it for the duration of the request, so
 * logs and outgoing server-side calls can carry it. */
export const correlationIdMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const fromReq = getAsString(req.headers["x-correlation-id"]);
  const correlationID = fromReq ? fromReq : crypto.randomUUID();
  asyncLocalStorage.run({ correlationID }, () => next());
};

export const getCorrelationId = (): string | undefined => asyncLocalStorage.getStore()?.correlationID;
