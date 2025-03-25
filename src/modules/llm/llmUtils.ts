/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

//TODO: Handle deserialization
export const getTextFromHTML = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent || "";
