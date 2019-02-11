
import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Field } from 'formik'

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

const FormikFieldLabel = ({label, noBorder, name}) => {
    if (!label){
        return null;
    }
    if (!noBorder){
        return <label htmlFor={name}>{label}</label>;
    }
    return (
        <label className="u-hidden" htmlFor={name}>
            {label}
        </label>
    )
}

FormikFieldLabel.propTypes = {
  noBorder: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export const FormikField = ({ className, label, name, noBorder, title, right, ...rest }) => (
  <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
    <FormikFieldLabel label={label} name={name} noBorder={noBorder} />
    <Field name={name} {...rest} />
  </div>
);

FormikField.propTypes = {
  noBorder: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

FormikField.defaultProps = {
  noBorder: false,
};
