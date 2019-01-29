/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { spacing } from '@ndla/core';

const StyledRow = styled('div')`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${p => spacing[p.spacing] || spacing.normal};
  ${p => p.justifyContent && `justify-content: ${p.justifyContent}`};
  ${p => p.alignItems && `align-items: ${p.alignItems}`};
`;

const Row = props => <StyledRow {...props} />;

Row.defaultProps = {
  spacing: 'normal',
};

Row.propTypes = {
  spacing: PropTypes.oneOf(['xsmall', 'small', 'normal', 'medium', 'large']),
  alignItems: PropTypes.oneOf([
    'normal',
    'start',
    'end',
    'center',
    'stretch',
    'baseline',
  ]),
  justifyContent: PropTypes.oneOf([
    'start',
    'end',
    'center',
    'stretch',
    'baseline',
    'space-around',
    'space-between',
    'space-evenly',
  ]),
};

export default Row;
