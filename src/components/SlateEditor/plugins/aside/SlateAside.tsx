/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode } from 'react';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import PropTypes from 'prop-types';
import SlateRightAside from './SlateRightAside';
import SlateFactAside from './SlateFactAside';
import { EditorShape } from '../../../../shapes';
import { AsideElement, TYPE_ASIDE } from '.';

interface Props {
  element: AsideElement;
  editor: Editor;
  children: ReactNode;
}

const SlateAside = (props: Props) => {
  const { element, editor } = props;

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_ASIDE,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_ASIDE,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: 'start' });
    }, 0);
  };

  const type = element.data.type;

  switch (type) {
    case 'rightAside':
      return (
        <SlateRightAside onRemoveClick={onRemoveClick} onMoveContent={onMoveContent} {...props} />
      );
    case 'factAside':
      return (
        <SlateFactAside onRemoveClick={onRemoveClick} onMoveContent={onMoveContent} {...props} />
      );
    default: {
      return (
        <SlateFactAside onRemoveClick={onRemoveClick} onMoveContent={onMoveContent} {...props} />
      );
    }
  }
};

SlateAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: PropTypes.any,
  editor: EditorShape,
};

export default SlateAside;
