/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef, MouseEvent, ReactNode } from "react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";

const EditButton = styled(ButtonV2)<{ isActive: boolean }>`
  transition: color 200ms ease;
  color: ${(props) => (props.isActive ? "#fff" : colors.brand.grey)};
  padding: ${spacing.xsmall};
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus,
  &:hover {
    color: #fff;
  }
`;
interface Props {
  isActive?: boolean;
  disabled?: boolean;
  children: ReactNode;
  tabIndex: number;
  onClick: (evt: MouseEvent<HTMLButtonElement>) => void;
}

const ImageEditorButton = forwardRef<HTMLButtonElement, Props>(({ isActive, disabled, children, ...rest }, ref) => (
  <EditButton variant="stripped" isActive={!!isActive} disabled={disabled} ref={ref} {...rest}>
    {children}
  </EditButton>
));

export default ImageEditorButton;
