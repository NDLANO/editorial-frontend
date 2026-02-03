/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFieldContext, mergeProps } from "@ark-ui/react";
import { Label, LabelProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useCallback } from "react";

interface Props extends LabelProps {}

const StyledLabel = styled(Label, {
  base: {
    cursor: "default",
  },
});

export const ContentEditableFieldLabel = ({ children, ...props }: Props) => {
  const field = useFieldContext();
  const { htmlFor, ...rest } = mergeProps(field?.getLabelProps(), props);

  const onClick = useCallback(() => {
    document.getElementById(field?.ids.control)?.focus();
  }, [field?.ids.control]);

  return (
    <StyledLabel asChild consumeCss onClick={onClick} {...(rest as LabelProps)}>
      <p>{children}</p>
    </StyledLabel>
  );
};
