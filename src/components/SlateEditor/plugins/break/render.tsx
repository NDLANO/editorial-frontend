/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_BREAK } from './types';

export const breakRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_BREAK) {
      return (
        <div {...attributes} contentEditable={false}>
          <br />
          {children}
        </div>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
