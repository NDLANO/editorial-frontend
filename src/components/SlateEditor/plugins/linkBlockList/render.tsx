/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_LINK_BLOCK_LIST } from './types';
import SlateLinkBlockList from './SlateLinkBlockList';

export const linkBlockListRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_LINK_BLOCK_LIST) {
      return (
        <SlateLinkBlockList attributes={attributes} element={element} editor={editor}>
          {children}
        </SlateLinkBlockList>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
