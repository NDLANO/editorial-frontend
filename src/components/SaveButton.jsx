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
import isEmpty from 'lodash/fp/isEmpty';

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

const buttonIconStyle = css`
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
  ...rest
}) => {
  const getModifier = () => {
    if (isSaving) return 'saving';
    if (showSaved) return 'saved';
    if (!isEmpty(errors) && touched) return 'error';
    return defaultText || 'save';
  };

  const modifier = getModifier();
  return (
    <Button
      disabled={isSaving || !formIsDirty}
      submit
      css={appereances[modifier]}
      {...rest}>
      <StyledSpan>
        {t(`form.${modifier}`)}
        {showSaved && <Check css={buttonIconStyle} />}
        {modifier === 'error' && <Cross css={buttonIconStyle} />}
      </StyledSpan>
    </Button>
  );
};

SaveButton.propTypes = {
  isSaving: bool,
  showSaved: bool,
  defaultText: string,
  formIsDirty: bool,
  errors: PropTypes.shape({}),
  touched: PropTypes.shape({}),
};

SaveButton.defaultProps = {
  formIsDirty: true,
};

export default injectT(SaveButton);
