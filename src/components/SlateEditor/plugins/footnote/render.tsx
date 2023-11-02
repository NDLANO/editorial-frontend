/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_FOOTNOTE } from './types';
import Footnote from './Footnote';

export const footnoteRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ element, attributes, children }) => {
    if (element.type === TYPE_FOOTNOTE) {
      <Footnote element={element} attributes={attributes} editor={editor}>
        {children}
      </Footnote>;
    } else return renderElement?.({ element, attributes, children });
  };

  return editor;
};
