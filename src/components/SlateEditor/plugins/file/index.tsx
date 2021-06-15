/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import Filelist from './Filelist';
import { defaultTextBlockNormalizer } from '../../utils/normalizationHelpers';

export const TYPE_FILE = 'file';

export interface FileElement {
  type: 'file';
  data: {
    type: string;
  };
  children: Descendant[];
}

export const filePlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;
  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    console.log(editor.children)
    if (element.type === TYPE_FILE) {
      return <Filelist editor={editor} element={element} attributes={attributes} />;
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_FILE) {
      defaultTextBlockNormalizer(editor, entry, nextNormalizeNode);
    } else {
      nextNormalizeNode(entry);
    }
  };

  return editor;
};
