/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, Attributes } from "react";

declare module "react/jsx-runtime" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ndlaembed: HTMLAttributes<HTMLElement> & Attributes;
    }
  }
}

// export class NdlaEmbed extends HTMLElement, Attributes {}
