/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const validTypesAi = ["summary", "metaDescription", "alttext", "alternativePhrasing", "reflection"];

export const isValidRequestBody = (body: any) => {
  const type = body?.type;
  if (!type || !validTypesAi.includes(type)) {
    return false;
  } else if ((type === "summary" || type === "metaDescription") && !body.title && !body.text) {
    return false;
  } else if (type === "alttext" && !body.image?.fileType && !body.image?.base64) {
    return false;
  } else if (type === "alternativePhrasing" && !body.text && !body.excerpt) {
    return false;
  } else if (type === "reflection" && !body.text) {
    return false;
  }
  return true;
};
