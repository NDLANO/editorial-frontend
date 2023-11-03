/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_BODYBOX } from './types';
import SlateBodybox from './SlateBodybox';

export const bodyboxRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_BODYBOX) {
      return (
        <SlateBodybox editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateBodybox>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
