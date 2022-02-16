/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { TYPE_SECTION } from '../../section';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import { TYPE_SPAN } from '..';

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

describe('span serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('serializing handles spans without attributes', () => {
    const editorWithoutAttributes: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: '' },
              { type: TYPE_SPAN, children: [{ text: 'test' }, { text: '' }] },
            ],
          },
        ],
      },
    ];

    const res = learningResourceContentToHTML(editorWithoutAttributes);
    expect(res).toMatch(htmlWithoutAttributes);
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
