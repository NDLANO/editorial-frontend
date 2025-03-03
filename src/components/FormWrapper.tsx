/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, ComponentPropsWithRef } from "react";
import { styled } from "@ndla/styled-system/jsx";
import { Form } from "./FormikForm";

interface Props extends ComponentPropsWithRef<"form"> {
  inDialog?: boolean;
  children: ReactNode;
}

const StyledForm = styled(Form, {
  base: {
    width: "100%",
  },
});

const FormWrapper = ({ inDialog, children, ...rest }: Props) => {
  if (inDialog) {
    return <StyledForm {...rest}>{children}</StyledForm>;
  }
  return <Form {...rest}>{children}</Form>;
};

export default FormWrapper;
