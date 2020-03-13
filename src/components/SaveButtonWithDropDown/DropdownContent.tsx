import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, spacing, fonts } from '@ndla/core';

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
  width: 100%;
  text-align: right;
  background: transparent;
  border: 0;
  padding: ${spacing.xsmall} ${spacing.normal} ${spacing.xsmall}
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

export interface OptionType {
  onClick: () => void;
  name: string;
  id: string;
}

interface SaveDropDownContentProps {
  options: OptionType[];
  setPopupState: (newState?: boolean) => void;
}

const DropdownContent: React.FC<SaveDropDownContentProps> = ({
  options,
  setPopupState,
}) => {
  return (
    <>
      <StyledList>
        {options.map(option => (
          <StyledListItem key={option.id}>
            <StyledButton
              css={checkItemStyle}
              onClick={() => {
                setPopupState(false);
                option.onClick();
              }}
              type="button">
              {option.name}
            </StyledButton>
          </StyledListItem>
        ))}
      </StyledList>
    </>
  );
};

export default DropdownContent;
