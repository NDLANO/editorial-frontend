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
import { css } from '@emotion/core';
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
  inModal,
  header,
  hidden,
  handleToggle,
  className,
  addButton,
  appearance,
  toggleSwitch,
  ...rest
}) => {
  const contentModifiers = appearance
    ? {
        hidden,
        visible: !hidden,
        [appearance]: true,
      }
    : {
        hidden,
        visible: !hidden,
      };

  const title = <span {...classes('title', appearance)}>{header}</span>;
  const arrow = hidden ? (
    <ExpandMore {...classes('arrow', appearance)} />
  ) : (
    <ExpandLess {...classes('arrow', appearance)} />
  );

  return (
    <div {...classes('', appearance)} {...rest}>
      {addButton ? (
        <AccordionButtonLine addButton={addButton} appearance={appearance}>
          <Button css={buttonStyle} stripped onClick={handleToggle}>
            {title}
          </Button>
          {toggleSwitch}
          {addButton}
          <Button css={arrowButtonStyle} stripped onClick={handleToggle}>
            {arrow}
          </Button>
        </AccordionButtonLine>
      ) : (
        <AccordionButtonLine
          appearance={appearance}
          handleToggle={handleToggle}>
          {title}
          {arrow}
        </AccordionButtonLine>
      )}
      <div
        {...classes(
          'content',
          contentModifiers,
          appearance || inModal ? '' : 'u-4/6@desktop u-push-1/6@desktop',
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
  inModal: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  hidden: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  addButtonAction: PropTypes.func,
  appearance: PropTypes.oneOf(['fill', 'resourceGroup', 'taxonomy']),
  toggleSwitch: PropTypes.node,
};

export default Accordion;
