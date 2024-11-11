/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { styled } from "@ndla/styled-system/jsx";
import { Form } from "./FormikForm";

interface Props {
  inModal?: boolean;
  children: ReactNode;
}

const StyledForm = styled(Form, {
  base: {
    width: "100%",
  },
});

const FormWrapper = ({ inModal, children }: Props) => {
  if (inModal) {
    return <StyledForm>{children}</StyledForm>;
  }
  return <Form>{children}</Form>;
};

export default FormWrapper;
