/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Element } from 'slate';
import {
  blockContentToEditorValue,
  blockContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_GRID, TYPE_GRID_CELL } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      {
        type: TYPE_GRID,
        data: {
          columns: 2,
        },
        children: [
          { type: TYPE_GRID_CELL, children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'a' }] }] },
          { type: TYPE_GRID_CELL, children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'a' }] }] },
        ],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
    ],
  },
];

const html = '<section><div data-type="grid" data-columns="2"><p>a</p><p>a</p></div></section>';

describe('file serializing tests', () => {
  test('serializing', () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
