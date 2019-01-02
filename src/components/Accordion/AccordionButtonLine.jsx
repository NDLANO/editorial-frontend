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

const classes = new BEMHelper({
  name: 'accordion',
  prefix: 'c-',
});

const appearances = {
  resourceGroup: css`
    &,
    &:hover {
      padding: 0;
      color: white;
      height: 50px;
      background: linear-gradient(180deg, white, ${colors.brand.greyLighter});
      border: 1px solid ${colors.brand.greyLighter};
    }
  `,
  fill: css`
    background-color: ${colors.brand.greyLightest};
    color: black;

    &:hover,
    &:focus {
      background-color: ${colors.brand.greyLightest};
    }
  `,
  taxonomy: css`
    &,
    &:hover {
      padding: 0;
      color: white;
      height: 50px;
      background: ${colors.brand.secondary};
      border: none;
    }
  `,
};

const buttonLineStyle = styledAppearance => css`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.6rem 0;

  ${appearances[styledAppearance]};
`;

function modifierToApperance(modifiers) {
  return Object.keys(modifiers).find(key => modifiers[key]);
}

const AccordionButtonLine = ({
  modifiers,
  handleToggle,
  addButton,
  children,
  ...rest
}) => {
  const styledAppearance = modifierToApperance(modifiers);
  console.log(modifierToApperance(modifiers));
  if (addButton) {
    return <div css={buttonLineStyle(styledAppearance)}>{children}</div>;
  }
  return (
    <Button
      css={buttonLineStyle(styledAppearance)}
      stripped
      onClick={handleToggle}>
      {children}
    </Button>
  );
};

AccordionButtonLine.propTypes = {
  modifiers: PropTypes.shape({
    fill: PropTypes.bool,
    resourceGroup: PropTypes.bool,
    taxonomy: PropTypes.bool,
  }),
  children: PropTypes.node,
  addButton: PropTypes.node,
  handleToggle: PropTypes.func.isRequired,
};

export default AccordionButtonLine;
