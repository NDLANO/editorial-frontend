import React from 'react';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Check } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import { colors, spacing, fonts } from '@ndla/core';
import { TranslateType } from '../interfaces';

interface AppearanceMap {
  [index: string]: SerializedStyles;
}

export const saveButtonAppearances: AppearanceMap = {
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

const largerButtonStyle = css`
  height: ${spacing.large};
  padding: 0 ${spacing.normal};
  ${fonts.sizes(18, 1.25)};
`;

interface Props {
  isSaving: boolean;
  showSaved: boolean;
  defaultText: string;
  formIsDirty: boolean;
  large: boolean;
  disabled: boolean;
  onClick: () => void;
  t: TranslateType;
  clippedButton?: boolean;
}

const SaveButton: React.FC<Props> = ({
  isSaving,
  showSaved,
  t,
  defaultText,
  formIsDirty,
  large,
  disabled,
  onClick,
  clippedButton,
  ...rest
}) => {
  const getModifier = () => {
    if (isSaving) return 'saving';
    if (showSaved) return 'saved';
    return defaultText || 'save';
  };
  const modifier = getModifier();
  const disabledButton = isSaving || !formIsDirty || disabled;

  return (
    <>
      <Button
        disabled={disabledButton}
        onClick={onClick}
        clippedButton={clippedButton}
        css={[
          large ? largerButtonStyle : null,
          saveButtonAppearances[modifier],
        ]}
        {...rest}>
        <StyledSpan>
          {t(`form.${modifier}`)}
          {showSaved && <Check css={checkStyle} />}
        </StyledSpan>
      </Button>
    </>
  );
};

SaveButton.defaultProps = {
  formIsDirty: true,
};

export default injectT(SaveButton);
