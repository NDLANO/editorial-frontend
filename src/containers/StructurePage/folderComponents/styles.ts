import styled from '@emotion/styled';
import { css } from '@emotion/core';
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
