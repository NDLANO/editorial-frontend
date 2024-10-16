/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { spacing, spacingUnit } from "@ndla/core";

const ELEMENT_HEIGHT = 69;

const StyledElementImage = styled.img`
  width: ${ELEMENT_HEIGHT * 1.33}px;
  height: ${ELEMENT_HEIGHT - spacingUnit / 2}px;
  object-fit: cover;
  margin-right: ${spacing.small};
  flex-shrink: 0;
`;
interface Props {
  url: string | undefined;
  alt: string | undefined;
}

const ElementImage = ({ url, alt }: Props) => (
  <StyledElementImage src={(url && `${url}?width=100`) || "/placeholder.png"} alt={alt || ""} />
);

export default ElementImage;
