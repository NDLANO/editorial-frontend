import React, { useState } from 'react';
import Button from '@ndla/button';
import { PopUpWrapper } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import { Check } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import { colors, spacing, fonts, animations } from '@ndla/core';
import ChevronDown from '@ndla/icons/lib/common/ChevronDown';
import typography from '@ndla/core/lib/typography';
import misc from '@ndla/core/lib/misc';
import FocusTrapReact from 'focus-trap-react';
import { TranslateType } from '../interfaces';
import { saveButtonAppearances } from './SaveButton';

const StyledWrapper = styled.div`
  position: relative;
`;

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

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
`;

const StyledListItem = styled.li`
  padding: 0;
  margin: 0;
`;

const StyledButton = styled.button`
  background: transparent;
  border: 0;
  padding: ${spacing.xsmall} ${spacing.large} ${spacing.xsmall}
    ${spacing.normal};
  &:disabled {
    color: ${colors.text.light};
  }
  &:not(:disabled) {
    cursor: pointer;
    svg {
      opacity: 0;
    }
    &:hover {
      background: ${colors.brand.greyLighter};
      svg {
        opacity: 0.5;
      }
    }
  }
`;

type StyledOptionProps = {
  verticalPosition?: 'top' | 'bottom' | 'center';
  position?: 'left' | 'right' | 'center';
  offsetY?: number | string;
  offsetX?: number | string;
  background?: string;
  withCloseButton?: boolean;
};

interface StyledChevronDownProps {
  rotate: number;
}

const StyledChevronDown = styled(ChevronDown)<StyledChevronDownProps>`
  transition: transform 200ms ease;
  transform: rotate(${props => props.rotate}deg);
`;

const StyledOptionWrapperAnimation = styled.div<StyledOptionProps>`
  filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.4));
  position: absolute;
  ${props => {
    if (props.position === 'left') {
      return css`
        left: ${props.offsetX};
      `;
    } else if (props.position === 'right') {
      return css`
        right: ${props.offsetX};
      `;
    }
  }}
  ${props => {
    if (props.verticalPosition === 'top') {
      return css`
        top: ${props.offsetY};
      `;
    } else if (props.verticalPosition === 'bottom') {
      return css`
        bottom: ${props.offsetY};
      `;
    }
  }}
  z-index: 1;
  ${animations.fadeInBottom(animations.durations.fast)}
`;

const StyledOptionContent = styled.div`
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  animation-delay: 100ms;
  animation-fill-mode: forwards;
  ${animations.fadeInBottom()}
`;

const StyledOptionWrapper = styled.div<StyledOptionProps>`
  width: 30vw;
  background: ${props => props.background};
  border-radius: ${misc.borderRadius};
  display: flex;
  flex-direction: column;
  animation-duration: 200ms;
  animation-name: wrapperAnimation;
  animation-timing-function: cubic-bezier(0.46, 0.01, 0.19, 1);
  animation-fill-mode: forwards;
  @keyframes wrapperAnimation {
    0% {
      clip-path: inset(99% 99% 0 0 round 1%);
    }
    100% {
      clip-path: inset(0 0 0 0 round 0%);
    }
  }
`;

const checkItemStyle = css`
  white-space: nowrap;
  display: flex;
  width: 100%;
  align-items: center;
  color: ${colors.text.primary};
  ${fonts.sizes('18px', '22px')};
  font-weight: ${fonts.weight.semibold};
  svg {
    width: ${spacing.normal};
    height: ${spacing.normal};
    fill: ${colors.support.green};
    margin-right: ${spacing.xsmall};
  }
`;

interface OptionType {
  func: () => void;
  name: string;
}

const SaveDropDownContent = ({}) => {
  const options = [
    {
      name: 'Lagre',
      id: 'save',
      func: () => {
        console.log('New');
      },
    },
    {
      name: 'Lagre som ny versjon',
      id: 'saveAsNewVersion',
      func: () => {
        console.log('Ny ver');
      },
    },
  ];

  const onSelect = (option: OptionType) => {
    option.func();
  };

  return (
    <>
      <StyledList>
        {options.map(option => (
          <StyledListItem key={option.id}>
            <StyledButton
              css={checkItemStyle}
              onClick={() => onSelect(option)}
              type="button">
              {option.name}
            </StyledButton>
          </StyledListItem>
        ))}
      </StyledList>
    </>
  );
};

interface WrapperProps {
  modifier: string;
  large: boolean;
  disabled: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const DropDownArrow: React.FC<WrapperProps> = ({
  modifier,
  large,
  disabled,
  onOpen,
  onClose,
  ...rest
}) => {
  const [isOpen, toggleIsOpen] = useState(false);
  const setPopupState = (newState?: boolean) => {
    toggleIsOpen(!!newState);
    if (newState && onOpen) {
      onOpen();
    } else if (!newState && onClose) {
      onClose();
    }
  };

  return (
    <StyledWrapper>
      <FocusTrapReact
        active={isOpen}
        focusTrapOptions={{
          onDeactivate: () => setPopupState(false),
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
        }}>
        <div>
          <Button
            disabled={disabled}
            clippedButtonAttachment
            onClick={() => setPopupState(!isOpen)}
            css={[
              large ? largerButtonStyle : null,
              saveButtonAppearances[modifier],
              css`
                margin-left: 2px;
                padding: 0;
              `,
            ]}
            {...rest}>
            <StyledChevronDown rotate={isOpen ? 180 : 0} />
          </Button>
          {isOpen && (
            <StyledOptionWrapperAnimation
              offsetX={`0`}
              offsetY={`${spacing.spacingUnit * 2}px`}
              position={'right'}
              verticalPosition={'bottom'}>
              <StyledOptionWrapper background={'white'}>
                <StyledOptionContent>
                  {<SaveDropDownContent />}
                </StyledOptionContent>
              </StyledOptionWrapper>
            </StyledOptionWrapperAnimation>
          )}
        </div>
      </FocusTrapReact>
    </StyledWrapper>
  );
};

interface Props {
  isSaving: boolean;
  showSaved: boolean;
  defaultText: string;
  formIsDirty: boolean;
  large: boolean;
  disabled: boolean;
  onClick: () => void;
  t: TranslateType;
}

const SaveButtonDropDown: React.FC<Props> = ({
  isSaving,
  showSaved,
  t,
  defaultText,
  formIsDirty,
  large,
  disabled,
  onClick,
  ...rest
}) => {
  const multiButton = true;
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
        clippedButton={multiButton}
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
      {multiButton && (
        <DropDownArrow
          disabled={disabledButton}
          modifier={modifier}
          large={large}
        />
      )}
    </>
  );
};

SaveButtonDropDown.defaultProps = {
  formIsDirty: true,
};

export default injectT(SaveButtonDropDown);
