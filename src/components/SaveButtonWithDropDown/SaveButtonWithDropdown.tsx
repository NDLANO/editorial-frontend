import React from 'react';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Check } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, fonts } from '@ndla/core';
import { TranslateType } from '../../interfaces';
import { saveButtonAppearances } from '../SaveButton';
import DropDownArrow from './DropdownArrow';

const StyledSpan = styled('span')`
  display: flex;
  justify-content: space-evenly;
`;

const checkStyle = css`
  width: 1.45rem;
  height: 1.45rem;
`;

export const largerButtonStyle = css`
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
  onClick: (saveAsNewVersion?: boolean) => void;
  t: TranslateType;
  savedToServer: boolean;
}

const SaveButtonWithDropdown: React.FC<Props> = ({
  isSaving,
  showSaved,
  t,
  defaultText,
  formIsDirty,
  large,
  disabled,
  onClick,
  savedToServer,
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
        clippedButton
        css={css`
          ${large ? largerButtonStyle : ''}
          ${saveButtonAppearances[modifier]}
        `}
        {...rest}>
        <StyledSpan>
          {t(`form.${modifier}`)}
          {showSaved && <Check css={checkStyle} />}
        </StyledSpan>
      </Button>
      <DropDownArrow
        disabled={disabledButton}
        modifier={modifier}
        large={large}
        options={[
          {
            id: 'save',
            name: t('form.save'),
            onClick: () => onClick(false),
          },
          {
            id: 'saveAsNewVersion',
            name: t('form.saveAsNewVersion'),
            onClick: () => onClick(true),
          },
        ]}
      />
    </>
  );
};

SaveButtonWithDropdown.defaultProps = {
  formIsDirty: true,
};

export default injectT(SaveButtonWithDropdown);
