/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import SlateDisclaimer from './SlateDisclaimer';
import { TYPE_DISCLAIMER } from './types';

export const disclaimerRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_DISCLAIMER) {
      return (
        <SlateDisclaimer attributes={attributes} element={element} editor={editor}>
          {children}
        </SlateDisclaimer>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
