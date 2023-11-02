/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_ASIDE } from './types';
import SlateAside from './SlateAside';

export const asideRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_ASIDE) {
      return (
        <SlateAside editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateAside>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
