/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

import { Button } from 'ndla-ui';
import { Arrow } from 'ndla-ui/icons';

const classes = new BEMHelper({
  name: 'accordion',
  prefix: 'c-',
});

const Accordion = ({
  fill,
  header,
  hidden,
  handleToggle,
  className,
  ...rest
}) => {
  const modifiers = {
    fill,
  };
  const contentModifiers = {
    hidden,
    visible: !hidden,
  };

  const buttonClasses = fill ? classes('button', 'fill') : classes('button');

  return (
    <div {...classes('', modifiers, className)} {...rest}>
      <Button {...buttonClasses} stripped onClick={handleToggle}>
        <span {...classes('header')}>
          {header}
        </span>
        <Arrow direction={`${hidden ? 'down' : 'up'}`} {...classes('arrow')} />
      </Button>
      <div {...classes('', contentModifiers, className)}>
        {rest.children}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,

  fill: PropTypes.bool,
  header: PropTypes.string,
  hidden: PropTypes.bool,
  handleToggle: PropTypes.func,
};

export default Accordion;
