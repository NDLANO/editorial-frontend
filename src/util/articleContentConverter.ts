/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import escapeHtml from 'escape-html';
import { Descendant, Text, Node } from 'new-slate';
import { Plain } from './slatePlainSerializer';
import { topicArticeRules, learningResourceRules } from './slateHelpers';
import { convertFromHTML } from './convertFromHTML';

// TODO: Rewrite
export const sectionSplitter = html => {
  const node = document.createElement('div');
  node.insertAdjacentHTML('beforeend', html);
  const sections = [];
  for (let i = 0; i < node.children.length; i += 1) {
    sections.push(node.children[i].outerHTML);
  }
  node.remove();
  return sections;
};

export const createEmptyValue = (): Descendant[] => [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];
// TODO: Rewrite
export const learningResourceContentToEditorValue = (html, fragment = undefined) => {
  if (!html) {
    return [createEmptyValue()];
  }

  const serializer = new Html({
    rules: learningResourceRules,
    parseHtml: fragment,
  });

  const sections = sectionSplitter(html);

  /**
   Map over each section and deserialize to get a new slate value. On this value, normalize with the schema rules and use the changed value. this
   implementation was needed because of v0.22.0 change (onBeforeChange was removed from componentWillReceiveProps in editor).
   https://github.com/ianstormtaylor/slate/issues/1111
  */
  return sections.map((section, index) => {
    /*   Slate's default sanitization just obliterates block nodes that contain both
    inline+text children and block children.
    see more here: https://github.com/ianstormtaylor/slate/issues/1497 */
    const json = serializer.deserialize(section, {
      toJSON: true,
      parseHtml: fragment,
    });

    const value = convertFromHTML(json);

    return value;
  });
};

// TODO: Rewrite
export function learningResourceContentToHTML(contentValues: Descendant[][]) {
  const serialize = (node: Descendant): string => {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);
      return string;
    }

    const children = node.children.map(n => serialize(n)).join('');

    switch (node.type) {
      case 'paragraph':
        return `<p>${children}</p>`;
      default:
        return children;
    }
  };
  return contentValues
    .map((descendants: Descendant[]) =>
      descendants.map((descendant: Descendant) => serialize(descendant)),
    )
    .join('')
    .replace(/<deleteme><\/deleteme>/g, '');
}

// TODO: Rewrite
export function topicArticleContentToEditorValue(html, fragment = undefined) {
  if (!html) {
    return [createEmptyValue()];
  }
  const serializer = new Html({ rules: topicArticeRules, parseHtml: fragment });

  /*   Slate's default sanitization just obliterates block nodes that contain both
  inline+text children and block children.
  see more here: https://github.com/ianstormtaylor/slate/issues/1497 */
  const json = serializer.deserialize(html, { toJSON: true });
  const value = convertFromHTML(json);
  return value;
}

// TODO: Rewrite
export function topicArticleContentToHTML(value) {
  const serializer = new Html({ rules: topicArticeRules });

  return serializer.serialize(value).replace(/<deleteme><\/deleteme>/g, '');
}

// TODO: Rewrite to TS only
export function plainTextToEditorValue(text: string): Descendant[] {
  return Plain.deserialize(text);
}

// TODO: Rewrite to TS only
export function editorValueToPlainText(editorValue: Descendant[]) {
  return editorValue ? Plain.serialize(editorValue) : '';
}
