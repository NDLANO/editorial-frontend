/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isPromptType, PromptPayload, PromptVariables } from "../interfaces";
import { unreachable } from "../util/guards";

export const isValidRequestBody = (
  body: Partial<PromptPayload<PromptVariables>>,
): body is PromptPayload<PromptVariables> => {
  const type = body.type;
  if (!isPromptType(type)) return false;

  switch (type) {
    case "summary":
    case "metaDescription":
      return !!body.title && !!body.text;
    case "altText":
      return !!body.image?.fileType && !!body.image?.base64;
    case "alternativePhrasing":
      return !!body.html;
    case "reflection":
      return !!body.text;
    default:
      return unreachable(type);
  }
};
