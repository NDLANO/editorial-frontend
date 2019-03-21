import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { Value } from 'slate';
import get from 'lodash/fp/get';
import { connect } from 'formik';
import { FormikShape } from '../shapes';
import FormikFieldLabel from './FormikFieldLabel';
import FormikFieldDescription from './FormikFieldDescription';
import { classes } from './';
import FormikFieldError from './FormikFieldError';

const FormikField = ({
  children,
  className,
  label,
  name,
  noBorder,
  title,
  right,
  description,
  obligatory,
  showError,
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
      <Field name={name} {...rest} {...fieldActions}>
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
      {showError && get(name, errors) && get(name, touched) && (
        <FormikFieldError>{get(name, errors)}</FormikFieldError>
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
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
};

export default connect(FormikField);
