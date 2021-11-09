/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { TYPE_PARAGRAPH } from '../utils';
import { TYPE_SECTION } from '../../section';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '123' }] },
      { type: TYPE_PARAGRAPH, children: [{ text: 'abc' }] },
    ],
  },
];

const html = '<section><p>123</p><p>abc</p></section>';

describe('paragraph serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('serializing handles empty paragraphs', () => {
    const editorWithEmptyParagraph: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '123' }] },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          { type: TYPE_PARAGRAPH, children: [{ text: 'abc' }] },
        ],
      },
    ];

    const res = learningResourceContentToHTML(editorWithEmptyParagraph);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });

  test('deserializing handles unwrapped text', () => {
    const htmlWithUnwrappedText = '<section>123<p>abc</p></section>';

    const res = learningResourceContentToEditorValue(htmlWithUnwrappedText);
    expect(res).toEqual(editor);
  });
});
