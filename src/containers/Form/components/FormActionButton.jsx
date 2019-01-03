import React from 'react';
import Button from '@ndla/button'; //checked
import { css } from 'react-emotion';

const buttonStyle = css`
  margin-right: 1rem;

  &:disabled {
    transform: none;
    color: #fff;
  }
`;

const FormActionButton = ({ children, ...rest }) => {
  return (
    <Button css={buttonStyle} {...rest}>
      {children}
    </Button>
  );
};

export default FormActionButton;
