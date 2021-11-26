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
import {
  TYPE_TABLE,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_CELL,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from '../utils';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';

describe('table serializing tests', () => {
  test('serializing and deserialize table', () => {
    const editor: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: 'title',
                  },
                ],
              },
              {
                type: TYPE_TABLE_HEAD,
                children: [
                  {
                    type: TYPE_TABLE_ROW,
                    children: [
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          isHeader: true,
                          colspan: 1,
                          rowspan: 1,
                          scope: undefined,
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
                          colspan: 1,
                          rowspan: 1,
                          scope: undefined,
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
                ],
              },
              {
                type: TYPE_TABLE_BODY,
                children: [
                  {
                    type: TYPE_TABLE_ROW,
                    children: [
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          isHeader: false,
                          colspan: 1,
                          rowspan: 1,
                          scope: undefined,
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
                          colspan: 1,
                          rowspan: 1,
                          scope: undefined,
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
                          colspan: 1,
                          rowspan: 1,
                          scope: undefined,
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
                          colspan: 1,
                          rowspan: 1,
                          scope: undefined,
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
      },
    ];

    const html =
      '<section><table><caption>title</caption><colgroup></colgroup><colgroup span="2"></colgroup><thead><tr><th><p>1</p></th><th><p>2</p></th></tr></thead><tbody><tr><td><p>3</p></td><td><p>4</p></td></tr><tr><td><p>5</p></td><td><p>6</p></td></tr></tbody></table></section>';

    const serialized = learningResourceContentToHTML(editor);
    expect(serialized).toMatch(html);

    const deserialized = learningResourceContentToEditorValue(html);
    expect(deserialized).toEqual(editor);
  });

  test('seriaize and deserialize table with row headers', () => {
    const editor: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_TABLE,
            rowHeaders: true,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_HEAD,
                children: [
                  {
                    type: TYPE_TABLE_ROW,
                    children: [
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          isHeader: true,
                          colspan: 1,
                          rowspan: 1,
                          scope: 'col',
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
                          colspan: 1,
                          rowspan: 1,
                          scope: 'col',
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
                ],
              },
              {
                type: TYPE_TABLE_BODY,
                children: [
                  {
                    type: TYPE_TABLE_ROW,
                    children: [
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          isHeader: true,
                          colspan: 1,
                          rowspan: 2,
                          scope: 'row',
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
                          colspan: 1,
                          rowspan: 1,
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
                          colspan: 1,
                          rowspan: 1,
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
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const html =
      '<section><table><colgroup></colgroup><colgroup span="2"></colgroup><thead><tr><th scope="col"><p>1</p></th><th scope="col"><p>2</p></th></tr></thead><tbody><tr><th rowspan="2" scope="row"><p>3</p></th><td><p>4</p></td></tr><tr><td><p>5</p></td></tr></tbody></table></section>';

    const serialized = learningResourceContentToHTML(editor);
    expect(serialized).toMatch(html);

    const deserialized = learningResourceContentToEditorValue(html);
    expect(deserialized).toEqual(editor);
  });
});
