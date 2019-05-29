import React from 'react';
import { bool, string } from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
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
};

const StyledSpan = styled('span')`
  display: flex;
  justify-content: space-evenly;
`;

const checkStyle = css`
  width: 1.45rem;
  height: 1.45rem;
`;

const SaveButton = ({
  isSaving,
  showSaved,
  t,
  defaultText,
  formIsDirty,
  ...rest
}) => {
  const getModifier = () => {
    if (isSaving) return 'saving';
    if (showSaved) return 'saved';
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
        {showSaved && <Check css={checkStyle} />}
      </StyledSpan>
    </Button>
  );
};

SaveButton.propTypes = {
  isSaving: bool,
  showSaved: bool,
  defaultText: string,
  formIsDirty: bool,
};

SaveButton.defaultProps = {
  formIsDirty: true,
};

export default injectT(SaveButton);
