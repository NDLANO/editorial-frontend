/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text, TextProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ComponentPropsWithRef } from "react";

const StyledText = styled(Text, {
  base: {
    marginInlineStart: "xsmall",
  },
});

interface Props extends TextProps, Omit<ComponentPropsWithRef<"p">, "color"> {}

export const RichTextIndicator = ({ textStyle = "label.xsmall", ...props }: Props) => (
  <StyledText textStyle={textStyle} asChild consumeCss {...props}>
    <span>(HTML)</span>
  </StyledText>
);
