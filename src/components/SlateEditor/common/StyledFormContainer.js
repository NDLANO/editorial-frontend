import styled from 'react-emotion';
import { colors } from '@ndla/core';

const StyledFormContainer = styled('div')`
  margin: 0;
  padding: 0.44em 0;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  clear: both;

  &:hover,
  &:focus {
    border-top: 1px solid ${colors.brand.greyLight};
    border-bottom: 1px solid ${colors.brand.greyLight};

    & > button {
      color: red;
      display: block;
      float: right;
    }
  }

  & ol,
  & ul {
    margin-top: 1rem;
  }

  & > button {
    display: none;
  }
`;

export default StyledFormContainer;
