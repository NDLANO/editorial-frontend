/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'ndla-button';
import { uuid } from 'ndla-util';
import { classes } from './WarningModal';

const WarningModalFooter = ({ component, actions }) =>
  component || (
    <div {...classes('footer')}>
      {actions.map(action => {
        const { text, ...rest } = action;
        return (
          <Button key={uuid()} outline {...rest}>
            {text}
          </Button>
        );
      })}
    </div>
  );

WarningModalFooter.propTypes = {
  component: PropTypes.node,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
};

WarningModalFooter.defaultProps = {
  actions: [],
};

export default WarningModalFooter;
