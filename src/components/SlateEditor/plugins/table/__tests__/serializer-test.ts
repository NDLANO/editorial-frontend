/**
 * Copyright (c) 2021-present, NDLA.
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
import { TYPE_TABLE, TYPE_TABLE_CELL, TYPE_TABLE_ROW } from '../utils';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';

const editor: Descendant[][] = [
  [
    {
      type: TYPE_SECTION,
      children: [
        {
          type: TYPE_TABLE,
          children: [
            {
              type: TYPE_TABLE_ROW,
              children: [
                {
                  type: TYPE_TABLE_CELL,
                  data: {
                    isHeader: true,
                  },
                  children: [
                    {
                      type: TYPE_PARAGRAPH,
                      children: [
                        {
                          text: '1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: TYPE_TABLE_CELL,
                  data: {
                    isHeader: true,
                  },
                  children: [
                    {
                      type: TYPE_PARAGRAPH,
                      children: [
                        {
                          text: '2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: TYPE_TABLE_ROW,
              children: [
                {
                  type: TYPE_TABLE_CELL,
                  data: {
                    isHeader: false,
                  },
                  children: [
                    {
                      type: TYPE_PARAGRAPH,
                      children: [
                        {
                          text: '3',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: TYPE_TABLE_CELL,
                  data: {
                    isHeader: false,
                  },
                  children: [
                    {
                      type: TYPE_PARAGRAPH,
                      children: [
                        {
                          text: '4',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: TYPE_TABLE_ROW,
              children: [
                {
                  type: TYPE_TABLE_CELL,
                  data: {
                    isHeader: false,
                  },
                  children: [
                    {
                      type: TYPE_PARAGRAPH,
                      children: [
                        {
                          text: '5',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: TYPE_TABLE_CELL,
                  data: {
                    isHeader: false,
                  },
                  children: [
                    {
                      type: TYPE_PARAGRAPH,
                      children: [
                        {
                          text: '6',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
];

const html =
  '<section><table><thead><tr><th><p>1</p></th><th><p>2</p></th></tr></thead><tbody><tr><td><p>3</p></td><td><p>4</p></td></tr><tr><td><p>5</p></td><td><p>6</p></td></tr></tbody></table></section>';

describe('related serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
