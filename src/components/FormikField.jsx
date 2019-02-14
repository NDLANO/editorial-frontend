import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Field, connect } from 'formik';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

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

const FormikFieldError = ({ children }) => (
  <span {...classes('help', 'error')}>{children}</span>
);

const FormikField = ({
  children,
  className,
  label,
  name,
  noBorder,
  title,
  right,
  formik,
  showError,
  ...rest
}) => {
  return (
    <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
      <FormikFieldLabel label={label} name={name} noBorder={noBorder} />
      <Field name={name} {...rest}>
        {children || null}
      </Field>
      {showError && formik.touched[name] && formik.errors[name] && (
        <FormikFieldError>{formik.errors[name](label)}</FormikFieldError>
      )}
    </div>
  );
};

FormikField.propTypes = {
  noBorder: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  showError: PropTypes.bool,
  formik: PropTypes.shape({
    form: PropTypes.shape({
      errors: PropTypes.shape({}),
      touched: PropTypes.shape({}),
    }),
  }),
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
};

export default connect(FormikField);
