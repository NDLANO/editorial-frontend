/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelper, TextProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useFormikContext } from "formik";
import { ComponentPropsWithRef } from "react";

const StyledFieldHelper = styled(FieldHelper, {
  base: {
    // TODO: Replace this
    color: "#8c8c00",
  },
});

interface Props extends TextProps, Omit<ComponentPropsWithRef<"div">, "color"> {
  name: string;
}

export const FieldWarning = ({ name, ...props }: Props) => {
  const { status } = useFormikContext();
  return <StyledFieldHelper {...props}>{status?.warnings?.[name]}</StyledFieldHelper>;
};
