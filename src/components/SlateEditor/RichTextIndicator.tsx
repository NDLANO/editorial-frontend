/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps } from "react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Text } from "@ndla/typography";

const StyledText = styled(Text)`
  margin-left: ${spacing.small};
`;

export const RichTextIndicator = (props: Omit<ComponentProps<"span">, "ref" | "children">) => {
  return (
    <StyledText element="span" textStyle="meta-text-small" {...props}>
      (HTML)
    </StyledText>
  );
};
