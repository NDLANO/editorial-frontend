import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Field, ErrorMessage } from 'formik';
import { Value } from 'slate';
import styled, { css } from 'react-emotion';
import { connect } from 'formik';
import { colors, fonts } from '@ndla/core';
import { isEmpty } from './validators';
import { FormikShape } from '../shapes';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

const StyledErrorMessage = styled.span`
  display: block;
  font-size: ${fonts.sizes(16, 1.2)};
  color: ${colors.support.red};
`;

export const FocusLabel = connect(
  ({ name, hasFocus, children, formik: { values } }) => {
    if (!hasFocus || isEmpty(values[name])) {
      return null;
    }
    return (
      <div className="c-field__focus-label">
        <span className="c-field__focus-text">{children}</span>
      </div>
    );
  },
);

FocusLabel.propTypes = {
  name: PropTypes.string.isRequired,
  hasFocus: PropTypes.func.isRequired,
  formik: FormikShape,
};

const FormikFieldLabel = ({ label, noBorder, name, hasFocus }) => {
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
      <FocusLabel name={name} hasFocus={hasFocus}>
        {label}
      </FocusLabel>
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

const FormikFieldDescription = ({ description, obligatory }) => {
  if (!description) {
    return null;
  }
  return (
    <StyledFormikDescriptionBlock>
      <StyledFormikDescription obligatory={obligatory}>
        {description}
      </StyledFormikDescription>
    </StyledFormikDescriptionBlock>
  );
};

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
  formik: { values, handleBlur },
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
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  formik: FormikShape,
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
};

export default connect(FormikField);
