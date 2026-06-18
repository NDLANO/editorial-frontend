/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isSpanContextValid, trace } from "@opentelemetry/api";
import { createLogger, transports, format } from "winston";
import "source-map-support/register";
import { getCorrelationId } from "./correlationContext";

const contextFormat = format((info) => {
  const correlationID = getCorrelationId();
  if (correlationID) info.correlationID = correlationID;

  const ctx = trace.getActiveSpan()?.spanContext();
  if (ctx && isSpanContextValid(ctx)) {
    info.trace_id = ctx.traceId;
    info.span_id = ctx.spanId;
    info.trace_flags = ctx.traceFlags.toString(16).padStart(2, "0");
  }
  return info;
});

const log = createLogger({
  defaultMeta: { service: "editorial-frontend" },
  format: format.combine(contextFormat(), format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [new transports.Console()],
});

export default log;
