import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Field, ErrorMessage } from 'formik';
import styled from 'react-emotion';
import { colors, fonts } from '@ndla/core';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

const StyledErrorMessage = styled.span`
  display: block;
  font-size: ${fonts.sizes(16, 1.2)};
  color: ${colors.support.red};
`;

const FormikFieldLabel = ({ label, noBorder, name }) => {
  if (!label) {
    return null;
  }
  if (!noBorder) {
    return <label htmlFor={name}>{label}</label>;
  }
  return (
    <label className="u-hidden" htmlFor={name}>
      {label}
    </label>
  );
};

FormikFieldLabel.propTypes = {
  noBorder: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export const FormikFieldError = ({ children }) => (
  <StyledErrorMessage>{children}</StyledErrorMessage>
);

const FormikField = ({
  children,
  className,
  label,
  name,
  noBorder,
  title,
  right,
  showError,
  ...rest
}) => {
  return (
    <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
      <FormikFieldLabel label={label} name={name} noBorder={noBorder} />
      <Field name={name} {...rest}>
        {children || null}
      </Field>
      {showError && (
        <ErrorMessage name={name}>
          {message => <StyledErrorMessage>{message}</StyledErrorMessage>}
        </ErrorMessage>
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
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
};

export default FormikField;
