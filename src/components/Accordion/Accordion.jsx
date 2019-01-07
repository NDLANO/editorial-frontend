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
import { css } from 'react-emotion';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { ExpandLess, ExpandMore } from '@ndla/icons/action';
import AccordionButtonLine from './AccordionButtonLine';

const classes = new BEMHelper({
  name: 'accordion',
  prefix: 'c-',
});

const buttonStyle = css`
  color: ${colors.brand.greyDark};
  width: 100%;
  height: 100%;
  text-align: left;
`;

const arrowButtonStyle = css`
  ${buttonStyle} min-width: 50px;
  width: 50px;
`;

const Accordion = ({
  fill,
  inModal,
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
        <AccordionButtonLine addButton={addButton} modifiers={modifiers}>
          <Button css={buttonStyle} stripped onClick={handleToggle}>
            {title}
          </Button>
          {addButton}
          <Button css={arrowButtonStyle} stripped onClick={handleToggle}>
            {arrow}
          </Button>
        </AccordionButtonLine>
      ) : (
        <AccordionButtonLine modifiers={modifiers} handleToggle={handleToggle}>
          {title}
          {arrow}
        </AccordionButtonLine>
      )}
      <div
        {...classes(
          'content',
          contentModifiers,
          taxonomy || resourceGroup || inModal
            ? ''
            : 'u-4/6@desktop u-push-1/6@desktop',
        )}>
        {rest.children}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  children: PropTypes.node,
  addButton: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  inModal: PropTypes.bool,
  taxonomy: PropTypes.bool,
  resourceGroup: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  hidden: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  addButtonAction: PropTypes.func,
};

export default Accordion;
