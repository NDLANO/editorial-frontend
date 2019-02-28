import styled, { css } from 'react-emotion';
import { spacing, colors } from '@ndla/core';

export const filterWrapper = css`
  background-color: white;
  padding: calc(${spacing.small} / 2);
  position: relative;
`;

export const StyledErrorMessage = styled('div')`
  color: ${colors.support.red};
  text-align: center;
`;
