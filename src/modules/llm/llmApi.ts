/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchAuthorized } from "../../util/apiHelpers";
import { resolveTextOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";
import { Payload } from "./llmApiTypes";

export const fetchAIGeneratedAnswer = async (payload: Payload): Promise<string> =>
  fetchAuthorized("/generate-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.text())
    .catch((r) => resolveTextOrRejectWithError(r));
