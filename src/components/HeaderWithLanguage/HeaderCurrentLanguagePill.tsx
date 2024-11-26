/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { CheckboxCircleFill } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  current?: boolean;
}

const StyledButton = styled(Button, {
  base: {
    cursor: "default",
  },
});

export const HeaderCurrentLanguagePill = ({ children, current, ...rest }: Props) => {
  return (
    <StyledButton variant="primary" size="small" asChild consumeCss data-current={current} {...rest} type={undefined}>
      <div>
        <CheckboxCircleFill />
        {children}
      </div>
    </StyledButton>
  );
};
