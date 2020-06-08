/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Field, connect, ErrorMessage } from 'formik';
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

const FormikField = ({
  children,
  className,
  label,
  name,
  maxLength,
  showMaxLength,
  noBorder,
  title,
  right,
  description,
  obligatory,
  showError,
  t,
  formik: { values, handleBlur, errors, touched },
  ...rest
}) => {
  const [focus, setFocus] = useState(false);

  const isSlateValue = Value.isValue(values[name]);
  const fieldActions = !isSlateValue
    ? {
        onFocus: () => {
          setFocus(true);
        },
        onBlur: (evt, editor, next) => {
          handleBlur(evt);
          setFocus(false);
        },
      }
    : {};
  const hasFocus = isSlateValue ? values[name].selection.isFocused : focus;
  return (
    <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
      <FormikFieldLabel
        hasFocus={hasFocus}
        label={label}
        name={name}
        noBorder={noBorder}
      />
      <FormikFieldDescription
        description={description}
        obligatory={obligatory}
      />
      <Field name={name} maxLength={maxLength} {...rest} {...fieldActions}>
        {children
          ? formikProps => {
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
        <FormikFieldHelp error={errors[name]}>
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
  children: PropTypes.func,
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  formik: FormikShape,
  maxLength: PropTypes.number,
  showMaxLength: PropTypes.bool,
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
  showMaxLength: false,
};

export default injectT(connect(FormikField));
