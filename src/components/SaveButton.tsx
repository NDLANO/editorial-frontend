/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

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

const StyledCheck = styled(Check)`
  width: 1.45rem;
  height: 1.45rem;
`;

interface StyledSaveButtonProps {
  large?: boolean;
  color?: string;
}

const StyledSaveButton = styled(Button)<StyledSaveButtonProps>`
  &,
  &:hover,
  &:disabled {
    color: white;
    transition: all 0.5s ease;
    background-color: ${p => p.color};
    border-color: ${p => p.color};
  }
  ${p =>
    p.large &&
    css`
      height: ${spacing.large};
      padding: 0 ${spacing.normal};
      ${fonts.sizes(18, 1.25)};
    `}
`;

interface Props {
  isSaving?: boolean;
  showSaved?: boolean;
  defaultText?: string;
  formIsDirty?: boolean;
  large?: boolean;
  disabled?: boolean;
  onClick: (evt: MouseEvent<HTMLButtonElement>) => void;
  clippedButton?: boolean;
  submit?: boolean;
}

const SaveButton = ({
  isSaving,
  showSaved,
  defaultText,
  formIsDirty = true,
  large,
  disabled,
  onClick,
  clippedButton,
  submit,
  ...rest
}: Props) => {
  const getModifier = () => {
    if (isSaving) return 'saving';
    if (showSaved) return 'saved';
    return defaultText || 'save';
  };

  const color = isSaving ? colors.support.greenLight : showSaved ? colors.support.green : undefined;
  const { t } = useTranslation();
  const modifier = getModifier();
  const disabledButton = isSaving || !formIsDirty || disabled;

  return (
    <>
      <StyledSaveButton
        disabled={disabledButton}
        onClick={onClick}
        clippedButton={clippedButton}
        submit={submit}
        large={large}
        color={color}
        {...rest}>
        <StyledSpan>
          {t(`form.${modifier}`)}
          {showSaved && <StyledCheck />}
        </StyledSpan>
      </StyledSaveButton>
    </>
  );
};

export default SaveButton;
