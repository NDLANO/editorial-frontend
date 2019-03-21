import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';

const StyledFormContainer = styled('div')`
  margin: 0;
  padding: ${spacing.small} 0;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  clear: both;

  &:hover,
  &:focus {
    border-top: 1px solid ${colors.brand.greyLight};
    border-bottom: 1px solid ${colors.brand.greyLight};

    .tooltipContainerClass {
      color: red;
      display: block;
      float: right;
    }
  }

  & ol,
  & ul {
    margin-top: 1rem;
  }

  .tooltipContainerClass {
    display: none;
  }
`;

export default StyledFormContainer;
