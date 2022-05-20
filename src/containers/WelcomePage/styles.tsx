import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

export const StyledColumnHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  & > span {
    text-transform: uppercase;
    margin-left: ${spacing.small};
  }
`;
