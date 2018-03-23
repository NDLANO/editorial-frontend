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
import { ExpandLess, ExpandMore } from 'ndla-icons/action';

const classes = new BEMHelper({
  name: 'accordion',
  prefix: 'c-',
});

const Accordion = ({
  fill,
  taksonomi,
  header,
  hidden,
  handleToggle,
  className,
  addButton,
  ...rest
}) => {
  const modifiers = {
    fill,
    taksonomi,
  };

  const contentModifiers = {
    hidden,
    visible: !hidden,
    taksonomi,
  };

  const title = <span {...classes('title', modifiers)}>{header}</span>;
  const arrow = hidden ? (
    <ExpandMore {...classes('arrow', modifiers, 'c-icon--medium')} />
  ) : (
    <ExpandLess {...classes('arrow', modifiers, 'c-icon--medium')} />
  );

  return (
    <div {...classes('', modifiers)} {...rest}>
      {addButton ? (
        <div {...classes('buttonLine', modifiers)}>
          <Button
            {...classes('button', modifiers)}
            stripped
            onClick={handleToggle}>
            {title}
          </Button>
          {addButton}
          <Button
            {...classes('button', { ...modifiers, arrow: true })}
            stripped
            onClick={handleToggle}>
            {arrow}
          </Button>
        </div>
      ) : (
        <Button
          {...classes('buttonLine', modifiers)}
          stripped
          onClick={handleToggle}>
          {title}
          {arrow}
        </Button>
      )}
      <div
        {...classes(
          'content',
          contentModifiers,
          taksonomi ? '' : 'u-4/6@desktop u-push-1/6@desktop',
        )}>
        {rest.children}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  addButton: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  taksonomi: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  hidden: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  addButtonAction: PropTypes.func,
};

export default Accordion;
