/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { TYPE_DIV } from './types';

export const divRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_DIV) {
      return <div {...attributes}>{children}</div>;
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
