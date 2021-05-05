/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Range, Transforms } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';

export const insertLink = (editor: Editor) => {
  if (editor.selection) {
    wrapLink(editor);
  }
};

const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n.type === 'link' || n.type === 'content-link'),
  });
  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n.type === 'link' || n.type === 'content-link'),
  });
};

const wrapLink = (editor: Editor) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link = jsx(
    'element',
    {
      type: 'link',
      href: '',
    },
    [],
  );

  if (!isCollapsed) {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};
