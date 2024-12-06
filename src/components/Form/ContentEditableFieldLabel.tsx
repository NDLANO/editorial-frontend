/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef } from "react";
import { useFieldContext } from "@ark-ui/react";
import { mergeProps } from "@zag-js/react";
import { Label, LabelProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends LabelProps {}

const StyledLabel = styled(Label, {
  base: {
    cursor: "default",
  },
});

export const ContentEditableFieldLabel = ({ children, ...props }: Props) => {
  const field = useFieldContext();
  const { htmlFor, ...rest } = mergeProps(field?.getLabelProps(), props);
  const ref = useRef<HTMLLabelElement>(null);

  return (
    <StyledLabel
      asChild
      consumeCss
      onClick={(_) => {
        document.getElementById(field?.ids.control)?.focus();
      }}
      {...(rest as LabelProps)}
      ref={ref}
    >
      <p>{children}</p>
    </StyledLabel>
  );
};
