/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from "formik";
import { ComponentProps, ReactNode, useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { utils } from "@ndla/core";
import { FieldHelper, FormControlProps, FormControl as InternalFormControl } from "@ndla/forms";
import useDebounce from "../util/useDebounce";

interface FormFieldProps<T = any> {
  name: string;
  children: (values: { field: FieldInputProps<T>; meta: FieldMetaProps<T>; helpers: FieldHelperProps<T> }) => ReactNode;
}

export const FormField = <T = any,>({ name, children }: FormFieldProps<T>) => {
  const [field, meta, helpers] = useField(name);
  return children({ field, meta, helpers });
};

export const FormControl = (props: Omit<FormControlProps, "id"> & ComponentProps<"div">) => {
  const id = useId();
  return <InternalFormControl id={id} {...props} />;
};

const HiddenSpan = styled(FieldHelper)`
  ${utils.visuallyHidden};
`;

interface Props extends ComponentProps<"div"> {
  value: number;
  maxLength: number;
  children?: ReactNode;
}

export const FormRemainingCharacters = ({ value, maxLength, children, ...rest }: Props) => {
  const { t } = useTranslation();
  const debouncedValue = useDebounce(value, 300);
  const debouncedTranslation = useMemo(() => {
    return t("form.remainingCharacters", { maxLength, remaining: maxLength - debouncedValue });
  }, [debouncedValue, maxLength, t]);

  return (
    <div {...rest}>
      <span aria-hidden="true">{t("form.remainingCharacters", { maxLength, remaining: maxLength - value })}</span>
      <HiddenSpan aria-live="polite">{debouncedTranslation}</HiddenSpan>
    </div>
  );
};
