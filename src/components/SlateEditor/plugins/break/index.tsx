/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { breakSerializer as _breakSerializer, breakPlugin as _breakPlugin } from "@ndla/editor";

const allowedBreakContainers = [
  "section",
  "div",
  "aside",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "summary",
  "pre",
];

export const breakSerializer = _breakSerializer.configure({
  allowedBreakContainers: allowedBreakContainers,
});

export const breakPlugin = _breakPlugin;
