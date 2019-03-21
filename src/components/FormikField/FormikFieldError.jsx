import React from 'react';
import styled from '@emotion/styled';
import { colors, fonts } from '@ndla/core';

const StyledErrorMessage = styled.span`
  display: block;
  font-size: ${fonts.sizes(16, 1.2)};
  color: ${colors.support.red};
`;

const FormikFieldError = ({ children }) => (
  <StyledErrorMessage>{children}</StyledErrorMessage>
);

export default FormikFieldError;
