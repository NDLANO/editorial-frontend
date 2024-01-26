/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from 'react';
import { Descendant, Editor, Text, Transforms } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';

export const isMarkActive = (editor: Editor, format: string) => {
  const marks: { [key: string]: boolean | string } | null = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const getMarkValue = (editor: Editor, format: keyof Omit<CustomTextWithMarks, 'text'>) => {
  const marks = Editor.marks(editor);
  return marks?.[format];
};

export interface CustomTextWithMarks {
  text: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underlined?: boolean;
  sup?: boolean;
  sub?: boolean;
  lang?: string;
}

const marks: { [key: string]: string } = {
  strong: 'bold',
  code: 'code',
  em: 'italic',
  u: 'underlined',
  sup: 'sup',
  sub: 'sub',
  lang: 'span',
};

export const markSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() === 'span' && el.lang) {
      return slatejsx('text', { lang: el.lang }, children);
    }
    if (!Object.keys(marks).includes(el.tagName.toLowerCase())) return;
    return children.map((child) =>
      Text.isText(child)
        ? slatejsx('text', { [marks[el.tagName.toLowerCase()]]: true }, child)
        : child,
    );
  },

  serialize(node: Descendant) {
    if (!Text.isText(node)) return;
    let ret;
    const children = node.text.split('\n').reduce((array: (ReactElement | string)[], text, i) => {
      if (i !== 0) array.push(<br key={i} />);
      array.push(text);
      return array;
    }, []);
    if (node.lang) {
      ret = <span lang={node.lang}>{children}</span>;
    }
    if (node.bold) {
      ret = <strong>{ret || children}</strong>;
    }
    if (node.italic) {
      ret = <em>{ret || children}</em>;
    }
    if (node.underlined) {
      ret = <u>{ret || children}</u>;
    }
    if (node.sup) {
      ret = <sup>{ret || children}</sup>;
    }
    if (node.sub) {
      ret = <sub>{ret || children}</sub>;
    }
    if (node.code) {
      ret = <code>{ret || children}</code>;
    }
    if (ret) {
      return ret;
    }
    return <>{children}</>;
  },
};

export const markPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Text.isText(node) && node.text === '') {
      if (
        node.lang ||
        node.bold ||
        node.code ||
        node.italic ||
        node.sub ||
        node.sup ||
        node.underlined
      ) {
        Transforms.unsetNodes(
          editor,
          ['lang', 'bold', 'code', 'italic', 'sub', 'sup', 'underlined'],
          {
            at: path,
          },
        );
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
