/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_KEY_FIGURE } from './types';
import SlateKeyFigure from './SlateKeyFigure';

export const keyFigureRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_KEY_FIGURE) {
      return (
        <SlateKeyFigure element={element} editor={editor} attributes={attributes}>
          {children}
        </SlateKeyFigure>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
