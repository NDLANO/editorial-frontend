/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from "@emotion/react";

/**
 *
 * Necessary component for handling keyboard navigation in and out of inline elements.
 * https://github.com/ianstormtaylor/slate/blob/d271c4be543027be2197f353d7ea61b51e9c48c6/site/examples/inlines.tsx#L77-L82
 *
 */
export const InlineBugfix = () => (
  <span
    contentEditable={false}
    css={css`
      font-size: 0;
    `}
  >
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);
