/*
 * Copyright (c) 2022-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // NOTE: We use `ndlaembed` for embedding content, this isn't a regular HTML-tag.
    //       Let's declare it so typescript doesn't complain when we're building it in JSX.
    export interface IntrinsicElements {
      ndlaembed: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export {};
