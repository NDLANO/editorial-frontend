import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Field, ErrorMessage } from 'formik';
import styled, { css } from 'react-emotion';
import { colors, fonts } from '@ndla/core';
import { isEmpty } from './validators';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

const StyledErrorMessage = styled.span`
  display: block;
  font-size: ${fonts.sizes(16, 1.2)};
  color: ${colors.support.red};
`;

export const FocusLabel = ({ name, value, hasFocus, children }) => {
  if (!hasFocus(name) || isEmpty(value)) {
    return null;
  }
  return (
    <div className="c-field__focus-label">
      <span className="c-field__focus-text">{children}</span>
    </div>
  );
};

FocusLabel.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ _immutable: PropTypes.object }),
  ]).isRequired,
  hasFocus: PropTypes.func.isRequired,
};

const FormikFieldLabel = ({ label, noBorder, name }) => {
  if (!label) {
    return null;
  }
  if (!noBorder) {
    return <label htmlFor={name}>{label}</label>;
  }
  return (
    <Fragment>
      <label className="u-hidden" htmlFor={name}>
        {label}
      </label>
    </Fragment>
  );
};

FormikFieldLabel.propTypes = {
  noBorder: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasFocus: PropTypes.func,
};

export const FormikFieldError = ({ children }) => (
  <StyledErrorMessage>{children}</StyledErrorMessage>
);

const StyledFormikDescriptionBlock = styled.span`
  display: flex;
`;

const obligatoryDescriptionStyle = css`
  background-color: rgba(230, 132, 154, 1);
  padding: 0.2em 0.6em;
`;

const StyledFormikDescription = styled.p`
  margin: 0.2em 0;
  font-size: 0.75em;
  ${p => (p.obligatory ? obligatoryDescriptionStyle : '')};
`;

const FormikFieldDescription = ({ description, obligatory }) =>
  description && (
    <StyledFormikDescriptionBlock>
      <StyledFormikDescription obligatory={obligatory}>
        {description}
      </StyledFormikDescription>
    </StyledFormikDescriptionBlock>
  );

FormikFieldDescription.propTypes = {
  obligatory: PropTypes.bool,
  description: PropTypes.string,
};

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
  hasFocus,
  onBlur,
  ...rest
}) => {
  const [focus, setFocus] = useState(false);

  const onFieldBlur = evt => {
    if (onBlur) {
      onBlur(evt);
    }
    setFocus(false);
  };

  return (
    <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
      <FormikFieldLabel
        focus={hasFocus || focus}
        label={label}
        name={name}
        noBorder={noBorder}
      />
      <FormikFieldDescription
        description={description}
        obligatory={obligatory}
      />
      <Field
        name={name}
        onFocus={() => setFocus(true)}
        onBlur={onFieldBlur}
        {...rest}>
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
  onBlur: PropTypes.func,
  showError: PropTypes.bool,
  children: PropTypes.func,
  obligatory: PropTypes.bool,
  hasFocus: PropTypes.bool,
  description: PropTypes.string,
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
};

export default FormikField;
