/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { markPlugin as _markPlugin, markSerializer as _markSerializer, CustomText } from "@ndla/editor";

export type CustomTextWithMarks = CustomText;

export const markSerializer = _markSerializer;

export const markPlugin = _markPlugin.configure({
  options: {
    // Omit underline everywhere.
    supportedMarks: { value: ["bold", "italic", "code", "sup", "sub"], override: true },
  },
});
