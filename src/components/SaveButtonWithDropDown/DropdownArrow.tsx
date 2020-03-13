import React, { useState } from 'react';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, animations } from '@ndla/core';
import ChevronDown from '@ndla/icons/lib/common/ChevronDown';
import misc from '@ndla/core/lib/misc';
import FocusTrapReact from 'focus-trap-react';
import { saveButtonAppearances } from '../SaveButton';
import { OptionType } from './DropdownContent';
import DropdownContent from './DropdownContent';
import { largerButtonStyle } from './SaveButtonWithDropdown';

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
const StyledWrapper = styled.div`
  position: relative;
`;

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
  width: 20vw;
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

interface DropDownArrowProps {
  modifier: string;
  large: boolean;
  disabled: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  options: OptionType[];
}

const DropDownArrow: React.FC<DropDownArrowProps> = ({
  modifier,
  large,
  disabled,
  onOpen,
  onClose,
  options,
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
                  {
                    <DropdownContent
                      options={options}
                      setPopupState={setPopupState}
                    />
                  }
                </StyledOptionContent>
              </StyledOptionWrapper>
            </StyledOptionWrapperAnimation>
          )}
        </div>
      </FocusTrapReact>
    </StyledWrapper>
  );
};

export default DropDownArrow;
