/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';

const MastheadButton = ({ children, color, minWidth, ...rest }) => {
  const css = `
        &,
        &:hover,
        &:focus {
            color: ${color};
            min-width: ${minWidth}rem;
            display: flex;
            justify-content: space-between;
            border: 1px solid #777;
            border-radius: 1px;
            background-color: white;
            padding: 0.2rem;
            height: 42px;
        }
        `;
  return (
    <Button {...rest} css={css}>
      {children}
    </Button>
  );
};

MastheadButton.propTypes = {
  color: PropTypes.string,
  minWidth: PropTypes.number,
};

MastheadButton.defaultProps = {
  color: '#777',
  minWidth: 0,
};

export default MastheadButton;
