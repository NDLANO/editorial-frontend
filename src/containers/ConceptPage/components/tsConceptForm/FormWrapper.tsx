/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import { Form } from 'formik';
import { formClasses } from '../../../FormikForm';

interface Props {
  inModal?: boolean;
  children: ReactElement[];
}

const FormWrapper = ({ inModal, children }: Props) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

export default FormWrapper;
