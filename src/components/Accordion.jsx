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
  taxonomy,
  resourceGroup,
  header,
  hidden,
  handleToggle,
  className,
  addButton,
  ...rest
}) => {
  const modifiers = {
    fill,
    taxonomy,
    resourceGroup,
  };

  const contentModifiers = {
    hidden,
    visible: !hidden,
    taxonomy,
    resourceGroup,
  };

  const title = <span {...classes('title', modifiers)}>{header}</span>;
  const arrow = hidden ? (
    <ExpandMore {...classes('arrow', modifiers)} />
  ) : (
    <ExpandLess {...classes('arrow', modifiers)} />
  );

  return (
    <div {...classes('', modifiers)} {...rest}>
      {addButton ? (
        <div {...classes('button-line', modifiers)}>
          <Button
            {...classes('button', modifiers)}
            stripped
            onClick={handleToggle}>
            {title}
          </Button>
          {addButton}
          <Button
            {...classes('button', { ...modifiers, arrowButton: true })}
            stripped
            onClick={handleToggle}>
            {arrow}
          </Button>
        </div>
      ) : (
        <Button
          {...classes('button-line', modifiers)}
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
          taxonomy || resourceGroup ? '' : 'u-4/6@desktop u-push-1/6@desktop',
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
  taxonomy: PropTypes.bool,
  resourceGroup: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  hidden: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  addButtonAction: PropTypes.func,
};

export default Accordion;
