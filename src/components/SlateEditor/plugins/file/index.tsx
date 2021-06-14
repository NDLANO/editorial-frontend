/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import Filelist from './Filelist';

export const TYPE_FILE = 'file';

export interface FileElement {
  type: 'file';
  data: {
    type: string;
  };
  children: Descendant[];
}

export const filePlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_FILE) {
      return <Filelist editor={editor} element={element} attributes={attributes} />;
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  return editor;
};
