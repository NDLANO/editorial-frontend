/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getCorrelationId } from "./correlationContext";

export const installCorrelationIdFetch = (): void => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const correlationID = getCorrelationId();
    if (!correlationID) return originalFetch(input, init);

    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    if (!headers.has("x-correlation-id")) {
      headers.set("x-correlation-id", correlationID);
    }
    return originalFetch(input, { ...init, headers });
  };
};
