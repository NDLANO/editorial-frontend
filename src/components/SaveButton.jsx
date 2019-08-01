import React from 'react';
import PropTypes from 'prop-types';
import { bool, string } from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Cross } from '@ndla/icons/action';
import { Check } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';

const appereances = {
  saved: css`
    &,
    &:hover,
    &:disabled {
      color: white;
      transition: all 0.5s ease;
      background-color: ${colors.support.green};
      border-color: ${colors.support.green};
    }
  `,
  saving: css`
    &,
    &:hover,
    &:disabled {
      color: white;
      transition: all 0.5s ease;
      background-color: ${colors.support.greenLight};
      border-color: ${colors.support.greenLight};
    }
  `,
  error: css`
    &,
    &:hover,
    &:disabled {
      color: white;
      transition: all 0.5s ease;
      background-color: ${colors.support.redLight};
      border-color: ${colors.support.redLight};
    }
  `,
};

const StyledSpan = styled('span')`
  display: flex;
  justify-content: space-evenly;
`;

const checkStyle = css`
  width: 1.45rem;
  height: 1.45rem;
`;
const crossStyle = css`
  width: 1.45rem;
  height: 1.45rem;
`;

const SaveButton = ({
  isSaving,
  showSaved,
  t,
  errors,
  defaultText,
  formIsDirty,
  touched,
  submitCount,
  ...rest
}) => {
  const getModifier = () => {
    if (isSaving) return 'saving';
    if (showSaved) return 'saved';
    if (!isEmpty(errors) && touched && submitCount > 0) return 'error';
    return defaultText || 'save';
  };

  const modifier = getModifier();
  return (
    <Button
      disabled={
        (isSaving || !formIsDirty || !isEmpty(errors)) && submitCount > 0
      }
      submit
      css={appereances[modifier]}
      {...rest}>
      <StyledSpan>
        {t(`form.${modifier}`)}
        {showSaved && <Check css={checkStyle} />}
        {!isEmpty(errors) && submitCount > 0 && <Cross css={crossStyle} />}
      </StyledSpan>
    </Button>
  );
};

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

SaveButton.propTypes = {
  isSaving: bool,
  showSaved: bool,
  defaultText: string,
  formIsDirty: bool,
  errors: PropTypes.shape({}),
  touched: PropTypes.shape({}),
  submitCount: PropTypes.number,
};

SaveButton.defaultProps = {
  formIsDirty: true,
};

export default injectT(SaveButton);
