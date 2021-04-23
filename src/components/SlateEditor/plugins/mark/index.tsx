import React from 'react';
import { Descendant, Editor, Text } from 'new-slate';
import { RenderLeafProps } from 'new-slate-react';
import { SlateSerializer } from '../../interfaces';
import { jsx } from 'new-slate-hyperscript';

export interface CustomTextWithMarks {
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
  deserialize(el: HTMLElement, children: (Descendant[] | Descendant | null)[]) {
    if (!Object.keys(marks).includes(el.tagName.toLowerCase())) return;
    return jsx('text', { [marks[el.tagName.toLowerCase()]]: true }, children);
  },

  serialize(node: Descendant, children: string) {
    if (!Text.isText(node)) return;
    let ret;
    if (node.bold) {
      ret = `<strong>${children}</strong>`;
    }
    if (node.italic) {
      ret = `<em>${ret || children}</em>`;
    }
    if (node.underlined) {
      ret = `<u>${ret || children}</u>`;
    }
    if (node.sup) {
      ret = `<sup>${ret || children}</sup>`;
    }
    if (node.sub) {
      ret = `<sub>${ret || children}</sub>`;
    }
    if (node.code) {
      ret = `<code>${ret || children}</code>`;
    }
    if (ret) {
      return ret;
    }
    return undefined;
  },
};

export const markPlugin = (editor: Editor) => {
  const { renderLeaf: nextRenderLeaf } = editor;

  editor.renderLeaf = ({ attributes, children, leaf, text }: RenderLeafProps) => {
    let ret;
    if (leaf.bold) {
      ret = <strong {...attributes}>{ret || children}</strong>;
    }
    if (leaf.italic) {
      ret = <em {...attributes}>{ret || children}</em>;
    }
    if (leaf.sup) {
      ret = <sup>{ret || children}</sup>;
    }
    if (leaf.sub) {
      ret = <sub>{ret || children}</sub>;
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

  return editor;
};
function escapeHtml(children: string): string {
  throw new Error('Function not implemented.');
}
