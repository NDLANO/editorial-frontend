/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";

const StyledInlineBugFix = styled.span`
  font-size: 0;
`;

/**
 *
 * Necessary component for handling keyboard navigation in and out of inline elements.
 * https://github.com/ianstormtaylor/slate/blob/d271c4be543027be2197f353d7ea61b51e9c48c6/site/examples/inlines.tsx#L77-L82
 *
 */
export const InlineBugfix = () => (
  <StyledInlineBugFix contentEditable={false}>{String.fromCodePoint(160) /* Non-breaking space */}</StyledInlineBugFix>
);
