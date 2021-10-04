/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import styled from '@emotion/styled';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';
import { TYPE_BODYBOX } from '.';

const StyledBodybox = styled('div')`
  position: relative;
`;

interface Props {
  editor: Editor;
}

const SlateBodybox = (props: Props & RenderElementProps) => {
  const { element, editor, attributes, children } = props;

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_BODYBOX,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_BODYBOX,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: 'start' });
    }, 0);
  };

  return (
    <StyledBodybox draggable className="c-bodybox" {...attributes}>
      {children}
      <DeleteButton tabIndex="-1" data-cy="remove-bodybox" stripped onMouseDown={onRemoveClick} />
      <MoveContentButton onMouseDown={onMoveContent} />
    </StyledBodybox>
  );
};

export default SlateBodybox;
