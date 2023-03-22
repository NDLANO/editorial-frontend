/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from 'react';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import { Field, FieldAttributes, FormikValues, FieldProps, useFormikContext } from 'formik';
import { Node } from 'slate';
import styled from '@emotion/styled';
import FormikFieldLabel from './FormikFieldLabel';
import FormikFieldDescription from './FormikFieldDescription';
import FormikFieldHelp from './FormikFieldHelp';
import FormikRemainingCharacters from './FormikRemainingCharacters';
import { StyledField } from '../Field';

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
  return (
    <StyledField noBorder={noBorder} right={right} isTitle={title} className={className}>
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
          getRemainingLabel={(maxLength, remaining) =>
            t('form.remainingCharacters', { maxLength, remaining })
          }
          value={isSlateValue ? Node.string(values[name][0]) : values[name]}
        />
      )}
      {showError && get(errors, name) && (
        <FormikFieldHelp error={!!get(errors, name)}>
          <StyledErrorPreLine>{get(errors, name)}</StyledErrorPreLine>
        </FormikFieldHelp>
      )}
      {status && status['warnings'] && (
        <FormikFieldHelp warning={!!get(status.warnings, name)}>
          <StyledErrorPreLine>{get(status.warnings, name)}</StyledErrorPreLine>
        </FormikFieldHelp>
      )}
    </StyledField>
  );
};

export default FormikField;
