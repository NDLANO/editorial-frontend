/**
 * Copyright (c) 2021-present, NDLA.
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
import { TYPE_SECTION } from '../../section/types';
import { TYPE_HEADING } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_HEADING, level: 1, children: [{ text: 'title1' }] },
      { type: TYPE_HEADING, level: 2, children: [{ text: 'title2' }] },
      { type: TYPE_HEADING, level: 3, children: [{ text: 'title3' }] },
      { type: TYPE_HEADING, level: 4, children: [{ text: 'title4' }] },
      { type: TYPE_HEADING, level: 5, children: [{ text: 'title5' }] },
      { type: TYPE_HEADING, level: 6, children: [{ text: 'title6' }] },
    ],
  },
];

const html =
  '<section><h1>title1</h1><h2>title2</h2><h3>title3</h3><h4>title4</h4><h5>title5</h5><h6>title6</h6></section>';

describe('heading serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const expected: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_HEADING, level: 2, children: [{ text: 'title1' }] },
          { type: TYPE_HEADING, level: 2, children: [{ text: 'title2' }] },
          { type: TYPE_HEADING, level: 3, children: [{ text: 'title3' }] },
          { type: TYPE_HEADING, level: 3, children: [{ text: 'title4' }] },
          { type: TYPE_HEADING, level: 3, children: [{ text: 'title5' }] },
          { type: TYPE_HEADING, level: 3, children: [{ text: 'title6' }] },
        ],
      },
    ];
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(expected);
  });
});
