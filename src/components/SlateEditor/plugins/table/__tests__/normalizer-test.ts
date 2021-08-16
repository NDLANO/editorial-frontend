/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import withPlugins from '../../../utils/withPlugins';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import { TYPE_SECTION } from '../../section';
import {
  TYPE_TABLE,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CELL,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from '../utils';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('table normalizer tests', () => {
  test('Make sure cells in first row is marked as header', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
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
                          isHeader: false,
                          colspan: 1,
                          rowspan: 1,
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
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
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
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('Make sure non-row element in table-head or body is wrapped in row', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
            children: [
              {
                type: TYPE_TABLE_HEAD,
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
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
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
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: '',
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
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('Make sure non-cell element in table row is wrapped in cell', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
            children: [
              {
                type: TYPE_TABLE_HEAD,
                children: [
                  {
                    type: TYPE_TABLE_ROW,
                    children: [
                      {
                        type: TYPE_PARAGRAPH,
                        children: [
                          {
                            text: '1',
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          isHeader: true,
                          colspan: 1,
                          rowspan: 1,
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
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
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
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('Add missing cells', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
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
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_TABLE,
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
                                text: '',
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
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
