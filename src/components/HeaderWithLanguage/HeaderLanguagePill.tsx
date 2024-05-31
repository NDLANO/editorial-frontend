/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "@emotion/styled";
import { buttonStyleV2 } from "@ndla/button";
import { spacing } from "@ndla/core";

const StyledLanguagePill = styled.div`
  ${buttonStyleV2({ size: "small" })}
  &[data-current="true"] {
    ${buttonStyleV2({ size: "small", colorTheme: "light" })}
    cursor: default;
  }
  margin-right: ${spacing.xsmall};
`;

interface Props extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  current?: boolean;
}

const LanguagePill = ({ children, current, ...rest }: Props) => {
  return (
    <StyledLanguagePill data-current={current} {...rest}>
      {children}
    </StyledLanguagePill>
  );
};

export default LanguagePill;
