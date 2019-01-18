/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button';
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
