/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import { Check } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import { colors, spacing, fonts } from '@ndla/core';

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
  isSaving?: boolean;
  showSaved?: boolean;
  defaultText?: string;
  formIsDirty?: boolean;
  large?: boolean;
  disabled?: boolean;
  onClick: (evt: Event) => void;
  clippedButton?: boolean;
  submit?: boolean;
}

const SaveButton = ({
  isSaving,
  showSaved,
  t,
  defaultText,
  formIsDirty = true,
  large,
  disabled,
  onClick,
  clippedButton,
  submit,
  ...rest
}: Props & tType) => {
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
        submit={submit}
        css={[large ? largerButtonStyle : null, saveButtonAppearances[modifier]]}
        {...rest}>
        <StyledSpan>
          {t(`form.${modifier}`)}
          {showSaved && <Check css={checkStyle} />}
        </StyledSpan>
      </Button>
    </>
  );
};

export default injectT(SaveButton);
