/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import SlateFileList from './SlateFileList';
import { TYPE_FILE } from './types';

export const fileRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_FILE) {
      return (
        <SlateFileList editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateFileList>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
