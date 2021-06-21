/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Text, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { RenderLeafProps } from 'slate-react';
import { SlateSerializer } from '../../interfaces';

export const isMarkActive = (editor: Editor, format: string) => {
  const marks: { [key: string]: boolean } | null = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export interface CustomTextWithMarks {
  text: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underlined?: boolean;
  sup?: boolean;
  sub?: boolean;
}

const marks: { [key: string]: string } = {
  strong: 'bold',
  code: 'code',
  em: 'italic',
  u: 'underlined',
  sup: 'sup',
  sub: 'sub',
};

export const markSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (!Object.keys(marks).includes(el.tagName.toLowerCase())) return;
    return jsx('text', { [marks[el.tagName.toLowerCase()]]: true }, children);
  },

  serialize(node: Descendant, children: (JSX.Element | null)[]) {
    if (!Text.isText(node)) return;
    let ret;
    if (node.bold) {
      ret = <strong>{children}</strong>;
    }
    if (node.italic) {
      ret = <em>{ret || children}</em>;
    }
    if (node.underlined) {
      ret = <u>{ret || children}</u>;
    }
    if (node.sup) {
      ret = <sup>${ret || children}</sup>;
    }
    if (node.sub) {
      ret = <sub>${ret || children}</sub>;
    }
    if (node.code) {
      ret = <code>${ret || children}</code>;
    }
    if (ret) {
      return ret;
    }
    return undefined;
  },
};

export const markPlugin = (editor: Editor) => {
  const { renderLeaf: nextRenderLeaf, normalizeNode: nextNormalizeNode } = editor;

  editor.renderLeaf = ({ attributes, children, leaf, text }: RenderLeafProps) => {
    let ret;
    if (leaf.bold) {
      ret = <strong {...attributes}>{ret || children}</strong>;
    }
    if (leaf.italic) {
      ret = <em {...attributes}>{ret || children}</em>;
    }
    if (leaf.sup) {
      ret = <sup {...attributes}>{ret || children}</sup>;
    }
    if (leaf.sub) {
      ret = <sub {...attributes}>{ret || children}</sub>;
    }
    if (leaf.underlined) {
      ret = <u {...attributes}>{ret || children}</u>;
    }
    if (leaf.code) {
      ret = (
        <code className="c-inline__code" {...attributes}>
          {ret || children}
        </code>
      );
    }
    if (ret) {
      return ret;
    }
    if (nextRenderLeaf) {
      return nextRenderLeaf({ attributes, children, leaf, text });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Text.isText(node) && node.text === '') {
      if (node.bold || node.code || node.italic || node.sub || node.sup || node.underlined) {
        Transforms.unsetNodes(editor, ['bold', 'code', 'italic', 'sub', 'sup', 'underlined'], {
          at: path,
        });
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
