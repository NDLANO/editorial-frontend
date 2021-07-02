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
import FileList from './FileList';
import { createEmbedTag } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import { File } from '../../../../interfaces';
import { defaultFileBlock } from './utils';
import { addSurroundingParagraphs } from '../../utils/normalizationHelpers';

export const TYPE_FILE = 'file';

export interface FileElement {
  type: 'file';
  data: File[];
  children: Descendant[];
}

export const fileSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== 'div') return;
    if (el.dataset.type !== TYPE_FILE) return;

    let childs: DOMStringMap[] = [];
    el.childNodes.forEach(node => {
      childs.push((node as HTMLEmbedElement).dataset);
    });
    return defaultFileBlock(childs);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_FILE) return;
    return <div data-type="file">{node.data.map(file => createEmbedTag(file))}</div>;
  },
};

export const filePlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    isVoid: nextIsVoid,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_FILE) {
      return (
        <FileList editor={editor} element={element} attributes={attributes}>
          {children}
        </FileList>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_FILE) {
      return true;
    }
    return nextIsVoid(element);
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_FILE) {
      if (addSurroundingParagraphs(editor, path)) {
        return;
      }
    } else {
      nextNormalizeNode(entry);
    }
  };

  return editor;
};
