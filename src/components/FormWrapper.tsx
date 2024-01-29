/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form } from "formik";
import { ReactNode } from "react";
import StyledForm from "./StyledFormComponents";

interface Props {
  inModal?: boolean;
  children: ReactNode;
}

const DivForm = StyledForm.withComponent("div");

const FormWrapper = ({ inModal, children }: Props) => {
  if (inModal) {
    return <DivForm>{children}</DivForm>;
  }
  return <Form>{children}</Form>;
};

export default FormWrapper;
