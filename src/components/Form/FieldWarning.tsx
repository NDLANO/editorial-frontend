/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { ComponentPropsWithRef, forwardRef } from "react";
import { FieldHelper, TextProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends ComponentPropsWithRef<"div"> {
  name: string;
}

const StyledFieldHelper = styled(FieldHelper, {
  base: {
    // TODO: Replace this
    color: "#8c8c00",
  },
});

export const FieldWarning = forwardRef<HTMLDivElement, Props & TextProps>(({ name, ...props }, ref) => {
  const { status } = useFormikContext();
  return (
    <StyledFieldHelper ref={ref} {...props}>
      {status?.warnings?.[name]}
    </StyledFieldHelper>
  );
});
