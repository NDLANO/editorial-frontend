/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Field, FieldAttributes, FormikValues, FieldProps, useFormikContext } from "formik";
import get from "lodash/get";
import { ReactElement, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Node } from "slate";
import styled from "@emotion/styled";
import FormikFieldDescription from "./FormikFieldDescription";
import FormikFieldHelp from "./FormikFieldHelp";
import FormikFieldLabel from "./FormikFieldLabel";
import FormikRemainingCharacters from "./FormikRemainingCharacters";
import { StyledField } from "../Field";

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

interface Props {
  noBorder?: boolean;
  right?: boolean;
  title?: boolean;
  name: string;
  label?: string;
  showError?: boolean;
  obligatory?: boolean;
  description?: string;
  maxLength?: number;
  showMaxLength?: boolean;
  className?: string;
  children?: (props: FieldProps & FieldAttributes<any>) => ReactElement;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}

const FormikField = ({
  children,
  className,
  label,
  name,
  maxLength,
  showMaxLength = false,
  noBorder = false,
  title = false,
  right = false,
  description,
  obligatory,
  showError = true,
  ...rest
}: Props) => {
  const { values, handleBlur, errors, status } = useFormikContext<FormikValues>();
  const { t } = useTranslation();
  const isSlateValue = Node.isNodeList(values[name]);
  const fieldActions: FieldAttributes<any> = !isSlateValue
    ? {
        onBlur: (evt: Event) => {
          handleBlur(evt);
        },
      }
    : {};

  const getRemainingLabel = useCallback(
    (maxLength: number, remaining: number) => {
      return t("form.remainingCharacters", { maxLength, remaining });
    },
    [t],
  );

  return (
    <StyledField data-no-border={noBorder} data-right={right} data-is-title={title} className={className}>
      <FormikFieldLabel label={label} name={name} noBorder={noBorder} />
      <FormikFieldDescription description={description} obligatory={obligatory} />
      <Field name={name} maxLength={maxLength} {...rest} {...fieldActions}>
        {children
          ? (formikProps: FormikValues) => {
              return children({
                ...formikProps,
                field: {
                  ...formikProps.field,
                  ...fieldActions,
                },
              });
            }
          : null}
      </Field>
      {showMaxLength && maxLength && (
        <FormikRemainingCharacters
          maxLength={maxLength}
          getRemainingLabel={getRemainingLabel}
          value={
            isSlateValue
              ? values[name]
                  .map((node: Node) => Node.string(node))
                  .reduce((str: string, acc: string) => (acc = acc + str), "")
              : values[name]
          }
        />
      )}
      {showError && get(errors, name) && (
        <FormikFieldHelp error={!!get(errors, name)}>
          <StyledErrorPreLine>{get(errors, name) as string}</StyledErrorPreLine>
        </FormikFieldHelp>
      )}
      {status && status["warnings"] && (
        <FormikFieldHelp warning={!!get(status.warnings, name)}>
          <StyledErrorPreLine>{get(status.warnings, name)}</StyledErrorPreLine>
        </FormikFieldHelp>
      )}
    </StyledField>
  );
};

export default FormikField;
