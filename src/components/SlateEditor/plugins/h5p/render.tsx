/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import SlateH5p from './SlateH5p';
import { TYPE_H5P } from './types';

export const h5pRenderer = (language: string) => (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_H5P) {
      return (
        <SlateH5p attributes={attributes} editor={editor} element={element} language={language}>
          {children}
        </SlateH5p>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
