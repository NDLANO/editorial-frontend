/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { TYPE_SECTION } from '../../section';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_DETAILS, TYPE_SUMMARY } from '..';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_DETAILS,
        children: [
          { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
          { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
        ],
      },
    ],
  },
];

const html = '<section><details><summary>title</summary><p>content</p></details></section>';

describe('details serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
