/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { trace } from "@opentelemetry/api";
import { NextFunction, Request, Response } from "express";

export const spanNamingMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const span = trace.getActiveSpan();
  if (span) {
    const firstSegment = req.path.split("/").filter(Boolean)[0];
    const routeName = firstSegment ? `/${firstSegment}` : "/";
    span.updateName(`${req.method} ${routeName}`);
    span.setAttribute("http.route", routeName);
  }
  next();
};
