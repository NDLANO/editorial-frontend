/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import {
  Field,
  connect,
  FormikContextType,
  FieldAttributes,
  FormikValues,
  FieldProps,
} from 'formik';
import { Value } from 'slate';
import styled from '@emotion/styled';
import { FormikShape } from '../../shapes';
import FormikFieldLabel from './FormikFieldLabel';
import FormikFieldDescription from './FormikFieldDescription';
import { classes } from './';
import FormikFieldHelp from './FormikFieldHelp';
import FormikRemainingCharacters from './FormikRemainingCharacters';

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
}

const FormikField = ({
  children,
  className,
  label,
  name,
  maxLength,
  showMaxLength,
  noBorder = false,
  title = false,
  right = false,
  description,
  obligatory,
  showError,
  t,
  formik: { values, handleBlur, errors, touched },
  ...rest
}: Props & tType & { formik: FormikContextType<FormikValues> }) => {
  const [focus, setFocus] = useState(false);

  const isSlateValue = Value.isValue(values[name]);
  const fieldActions: FieldAttributes<any> = !isSlateValue
    ? {
        onFocus: () => {
          setFocus(true);
        },
        onBlur: (evt: Event) => {
          handleBlur(evt);
          setFocus(false);
        },
      }
    : {};
  const hasFocus = isSlateValue ? values[name].selection.isFocused : focus;
  return (
    <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
      <FormikFieldLabel hasFocus={hasFocus} label={label} name={name} noBorder={noBorder} />
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
          value={isSlateValue ? values[name].document.text : values[name]}
        />
      )}
      {showError && errors[name] && (
        <FormikFieldHelp error={!!errors[name]}>
          <StyledErrorPreLine>{errors[name]}</StyledErrorPreLine>
        </FormikFieldHelp>
      )}
    </div>
  );
};

FormikField.propTypes = {
  noBorder: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  showError: PropTypes.bool,
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  formik: FormikShape,
  maxLength: PropTypes.number,
  showMaxLength: PropTypes.bool,
  children: PropTypes.func,
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
  showMaxLength: false,
};

export default injectT(connect<Props & tType, any>(FormikField));
