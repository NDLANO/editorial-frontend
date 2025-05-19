/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isPromptType } from "../modules/llm/llmApiTypes";

export const isValidRequestBody = (body: any) => {
  const type = body?.type;
  if (!isPromptType(type)) {
    return false;
  } else if ((type === "summary" || type === "metaDescription") && !body.title && !body.text) {
    return false;
  } else if (type === "altText" && !body.image?.fileType && !body.image?.base64) {
    return false;
  } else if (type === "alternativePhrasing" && !body.text && !body.excerpt) {
    return false;
  } else if (type === "reflection" && !body.text) {
    return false;
  }
  return true;
};
