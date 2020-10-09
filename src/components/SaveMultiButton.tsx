import React from 'react';
import { MultiButton } from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import { Check } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { saveButtonAppearances } from './SaveButton';

const StyledSpan = styled('span')`
  display: flex;
  justify-content: space-evenly;
`;

const Wrapper = styled('div')`
  button {
    ${(props: { modifier: string }) => {
      return saveButtonAppearances[props.modifier];
    }}
  }
`;

const checkStyle = css`
  width: 1.45rem;
  height: 1.45rem;
`;

interface Props {
  isSaving: boolean;
  showSaved: boolean;
  formIsDirty: boolean;
  large: boolean;
  disabled: boolean;
  onClick: (saveAsNew: boolean) => void;
  clippedButton?: boolean;
  hideSecondaryButton?: boolean;
}

const SaveMultiButton: React.FC<Props & tType> = ({
  isSaving,
  showSaved,
  t,
  formIsDirty,
  large,
  disabled,
  onClick,
  hideSecondaryButton,
  ...rest
}) => {
  const getModifier = () => {
    if (isSaving) return 'saving';
    if (showSaved) return 'saved';
    return 'save';
  };
  const modifier = getModifier();
  const disabledButton = isSaving || !formIsDirty || disabled;

  return (
    <>
      <Wrapper
        modifier={modifier}
        data-testid="saveLearningResourceButtonWrapper">
        <MultiButton
          disabled={disabledButton}
          onClick={(value: string) => {
            const saveAsNewVersion = value === 'saveAsNew';
            onClick(saveAsNewVersion);
          }}
          mainButton={{ value: 'save' }}
          secondaryButtons={
            hideSecondaryButton
              ? []
              : [
                  {
                    label: t('form.saveAsNewVersion'),
                    value: 'saveAsNew',
                  },
                  {
                    label: t('form.save'),
                    value: 'save',
                  },
                ]
          }
          large
          {...rest}>
          <StyledSpan>
            {t(`form.${modifier}`)}
            {showSaved && <Check css={checkStyle} />}
          </StyledSpan>
        </MultiButton>
      </Wrapper>
    </>
  );
};

SaveMultiButton.defaultProps = {
  formIsDirty: true,
};

export default injectT(SaveMultiButton);
