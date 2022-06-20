/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import { animations } from '@ndla/core';
const appearances: Record<string, SerializedStyles> = {
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
  lighter: css`
    background: rgba(1, 1, 1, 0.3);
    z-index: 2;
  `,
};

const getAllAppearances = (modifiers: string | string[]) => {
  if (Array.isArray(modifiers)) {
    return modifiers.map(modifier => appearances[modifier]);
  }
  return appearances[modifiers];
};

const StyledOverlay = styled.div<{ modifiers: string | string[] }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);

  ${animations.fadeIn()}
  ${p => getAllAppearances(p.modifiers)}
`;

interface Props {
  onExit?: (event: MouseEvent) => void;
  modifiers?: string | string[];
}

const Overlay = ({ onExit, modifiers = '' }: Props) =>
  onExit ? (
    <StyledOverlay onClick={onExit} modifiers={modifiers} aria-hidden="true" />
  ) : (
    <StyledOverlay modifiers={modifiers} />
  );

export default Overlay;
