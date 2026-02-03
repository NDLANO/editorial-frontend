/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from "formik";
import { ReactNode } from "react";

interface FormFieldProps<T = any> {
  name: string;
  children: (values: { field: FieldInputProps<T>; meta: FieldMetaProps<T>; helpers: FieldHelperProps<T> }) => ReactNode;
}

export const FormField = <T = any>({ name, children }: FormFieldProps<T>) => {
  const [field, meta, helpers] = useField(name);
  return children({ field, meta, helpers });
};
