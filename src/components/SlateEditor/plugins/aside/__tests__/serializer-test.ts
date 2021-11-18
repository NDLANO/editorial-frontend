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
import { TYPE_ASIDE } from '..';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_ASIDE,
        data: { type: 'factAside' },
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
      },
      {
        type: TYPE_ASIDE,
        data: { type: 'rightAside' },
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
      },
    ],
  },
];

const html =
  '<section><aside data-type="factAside"><p>content</p></aside><aside data-type="rightAside"><p>content</p></aside></section>';

describe('aside serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
