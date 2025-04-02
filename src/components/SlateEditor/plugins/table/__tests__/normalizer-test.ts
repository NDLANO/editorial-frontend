/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import {
  TYPE_TABLE,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_BODY,
  TYPE_TABLE_ROW,
  TYPE_TABLE_CELL,
  TYPE_TABLE_CELL_HEADER,
} from "../types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("table normalizer tests", () => {
  test("Make sure non-row element in table-head or body is wrapped in row", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TYPE_TABLE_HEAD,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    children: [
                      {
                        text: "1",
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
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "4",
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
            children: [{ text: "" }],
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
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "",
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
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          scope: "col",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            serializeAsText: true,
                            children: [
                              {
                                text: "",
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
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "4",
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
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Make sure non-cell element in table row is wrapped in cell", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "",
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
                        type: TYPE_PARAGRAPH,
                        children: [
                          {
                            text: "1",
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "2",
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
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "4",
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
            children: [{ text: "" }],
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
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "",
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
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "2",
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
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "4",
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
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Add missing cells and caption", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_HEAD,
                children: [
                  {
                    type: TYPE_TABLE_ROW,
                    children: [
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "2",
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
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
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
            children: [{ text: "" }],
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
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "",
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
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "2",
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
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            serializeAsText: true,
                            children: [
                              {
                                text: "",
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
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Make sure row headers and table headers are set correctly when rowHeaders=true", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: true,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "",
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
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "2",
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
                          headers: "00",
                          colspan: 1,
                          rowspan: 2,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          headers: "01",
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "4",
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
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "5",
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
            children: [{ text: "" }],
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
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE,
            rowHeaders: true,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "",
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
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          id: "00",
                          rowspan: 1,
                          scope: "col",
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          id: "01",
                          rowspan: 1,
                          scope: "col",
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "2",
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
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          id: "r1",
                          headers: "00",
                          colspan: 1,
                          rowspan: 2,
                          scope: "row",
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          headers: "01 r1",
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "4",
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
                          headers: "01 r1",
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "5",
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
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
