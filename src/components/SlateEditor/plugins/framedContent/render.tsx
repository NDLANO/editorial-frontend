/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import SlateFramedContent from './SlateFramedContent';
import { TYPE_FRAMED_CONTENT } from './types';

export const framedContentRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_FRAMED_CONTENT) {
      return (
        <SlateFramedContent editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateFramedContent>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
