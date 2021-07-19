/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { TYPE_SECTION } from '..';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';

const editor: Descendant[][] = [
  [
    {
      type: TYPE_SECTION,
      children: [{ type: TYPE_PARAGRAPH, children: [{ text: '123' }] }],
    },
  ],
  [
    {
      type: TYPE_SECTION,
      children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'abc' }] }],
    },
  ],
];

const html = '<section><p>123</p></section><section><p>abc</p></section>';

describe('section serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });

  test('create empty <section> if html is undefined or empty string', () => {
    const expected = [
      [
        {
          type: TYPE_SECTION,
          children: [{ type: TYPE_PARAGRAPH, children: [{ text: '' }] }],
        },
      ],
    ];
    const res1 = learningResourceContentToEditorValue('');
    const res2 = learningResourceContentToEditorValue(undefined);
    expect(res1).toEqual(expected);
    expect(res2).toEqual(expected);
  });
});
