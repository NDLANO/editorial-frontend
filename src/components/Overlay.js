/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { animations } from '@ndla/core';
const appearances = {
  zIndex: css`
    z-index: 1;
  `,
  absolute: css`
    position: absolute;
    width: 100%;
    height: 100%;
  `,
  'white-opacity': css`
    opacity: 0.8;
    background-color: white;
  `,
};

const getAllAppearances = modifiers => {
  if (Array.isArray(modifiers)) {
    return modifiers.map(modifier => appearances[modifier]);
  }
  return appearances[modifiers];
};

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);

  ${animations.fadeIn()}
  ${p => getAllAppearances(p.modifiers)}
`;

const Overlay = ({ onExit, modifiers }) =>
  onExit ? (
    <StyledOverlay onClick={onExit} modifiers={modifiers} aria-hidden="true" />
  ) : (
    <StyledOverlay modifiers={modifiers} />
  );

Overlay.propTypes = {
  onExit: PropTypes.func,
  modifiers: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

Overlay.defaultProps = {
  modifiers: '',
};

export default Overlay;
