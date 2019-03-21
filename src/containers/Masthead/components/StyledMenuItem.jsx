import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { Link } from 'react-router-dom';

export const StyledMenuItem = styled(Link)`
  display: flex;
  width: 100%;
  padding: ${spacing.small};
  background: transparent;
  box-shadow: none;
  border: 0;
  color: ${colors.brand.primary};
  font-family: ${fonts.sans};
  font-weight: ${fonts.weight.semibold};
  white-space: nowrap;
  ${fonts.sizes(18, 1.1)};

  &:focus,
  &:hover {
    background: ${colors.brand.lighter} !important;
  }
`;
