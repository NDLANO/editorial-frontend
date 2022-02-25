/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_SPAN } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_PARAGRAPH,
        children: [
          { text: '' },
          { type: TYPE_SPAN, data: { lang: 'en' }, children: [{ text: 'test' }] },
          { text: '' },
        ],
      },
    ],
  },
];

const html = '<section><p><span lang="en">test</span></p></section>';
const htmlWithoutAttributes = '<section><p><span>test</span></p></section>';
const hmtlWithoutSpan = '<section><p>test</p></section>';

describe('span serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('serializing unwraps span without attributes', () => {
    const editorWithoutAttributes: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: '' },
              { type: TYPE_SPAN, data: {}, children: [{ text: 'test' }, { text: '' }] },
            ],
          },
        ],
      },
    ];

    const res = learningResourceContentToHTML(editorWithoutAttributes);
    expect(res).toMatch(hmtlWithoutSpan);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });

  test('deserializing handles span without attributes', () => {
    const editorWithoutSpan: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: 'test' }],
          },
        ],
      },
    ];

    const res = learningResourceContentToEditorValue(htmlWithoutAttributes);
    expect(res).toEqual(editorWithoutSpan);
  });
});
