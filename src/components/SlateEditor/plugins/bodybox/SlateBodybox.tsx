/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';
import { TYPE_BODYBOX } from './types';

const StyledBodybox = styled.div`
  position: relative;
  overflow: visible;
`;

interface Props {
  editor: Editor;
}

const SlateBodybox = (props: Props & RenderElementProps) => {
  const { element, editor, attributes, children } = props;
  const { t } = useTranslation();

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_BODYBOX,
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
      match: (node) => Element.isElement(node) && node.type === TYPE_BODYBOX,
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
      <DeleteButton
        aria-label={t('form.remove')}
        tabIndex={-1}
        data-cy="remove-bodybox"
        variant="stripped"
        onMouseDown={onRemoveClick}
      />
      <MoveContentButton onMouseDown={onMoveContent} />
    </StyledBodybox>
  );
};

export default SlateBodybox;
