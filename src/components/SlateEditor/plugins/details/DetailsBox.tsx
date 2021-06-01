/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Block, Document, Editor, Inline, Node, Text } from 'slate';
import { css } from '@emotion/core';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { Portal } from '../../../Portal';
import Details from './Details';
import { RenderElementProps } from 'slate-react';

const editButtonStyle = css`
  height: 100%;
  width: 26px;
  margin-left: ${spacing.normal};
  & > svg {
    width: 20px;
    height: 20px;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: ${spacing.normal};
    height: ${spacing.normal};
    background: ${colors.support.greenLight};
    border-radius: 100%;
    transform: scale(0.5);
    opacity: 0;
    transition: all 200ms ease;
  }

  &:hover,
  &:focus {
    &::before {
      transform: scale(1.25);
      opacity: 1;
    }
  }
`;

interface Props extends RenderElementProps {
  editor: Editor;
}

const DetailsBox = ({ t, attributes, children, editor, element }: Props & tType) => {
  return (
    <div draggable {...attributes}>
      <Details editor={editor} node={element}>
        {children}
      </Details>
    </div>
  );
};

export default injectT(DetailsBox);
