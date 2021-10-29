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
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import { TYPE_LIST, TYPE_LIST_ITEM } from '../types';

const editor: Descendant[][] = [
  [
    {
      type: TYPE_SECTION,
      children: [
        {
          type: TYPE_LIST,
          listType: 'letter-list',
          data: {},
          children: [
            {
              type: TYPE_LIST_ITEM,
              children: [
                {
                  type: TYPE_PARAGRAPH,
                  children: [
                    {
                      text: 'abc',
                    },
                  ],
                },
                {
                  type: TYPE_LIST,
                  listType: 'numbered-list',
                  data: {},
                  children: [
                    {
                      type: TYPE_LIST_ITEM,
                      children: [
                        {
                          type: TYPE_PARAGRAPH,
                          children: [
                            {
                              text: '123',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: TYPE_LIST,
                  listType: 'bulleted-list',
                  data: {},
                  children: [
                    {
                      type: TYPE_LIST_ITEM,
                      children: [
                        {
                          type: TYPE_PARAGRAPH,
                          children: [
                            {
                              text: 'def',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: TYPE_LIST_ITEM,
              children: [
                {
                  type: TYPE_PARAGRAPH,
                  children: [
                    {
                      text: 'ghi',
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
  '<section><ol data-type="letters"><li><p>abc</p><ol><li><p>123</p></li></ol><ul><li><p>def</p></li></ul></li><li><p>ghi</p></li></ol></section>';

describe('paragraph serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });

  test('deserializing <li> with plaintext as children', () => {
    const html =
      '<section><ol data-type="letters"><li>abc<strong>123</strong>def<p>paragraph</p>456</li></ol></section>';
    const expected: Descendant[][] = [
      [
        {
          type: 'section',
          children: [
            {
              type: 'list',
              listType: 'letter-list',
              data: {},
              children: [
                {
                  type: 'list-item',
                  children: [
                    {
                      type: 'paragraph',
                      serializeAsText: true,
                      children: [
                        {
                          text: 'abc',
                        },
                        {
                          bold: true,
                          text: '123',
                        },
                        {
                          text: 'def',
                        },
                      ],
                    },
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: 'paragraph',
                        },
                      ],
                    },
                    {
                      type: 'paragraph',
                      serializeAsText: true,
                      children: [
                        {
                          text: '456',
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
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(expected);
  });
});
