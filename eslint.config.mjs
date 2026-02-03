/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-check

import config from "eslint-config-ndla";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...config,
  {
    ignores: ["**/h5pResizer.ts"],
  },
);
