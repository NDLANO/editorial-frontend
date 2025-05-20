/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import {
  TABLE_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
} from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("table normalizer tests", () => {
  test("Make sure non-row element in table-head or body is wrapped in row", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    children: [
                      {
                        text: "1",
                      },
                    ],
                  },
                ],
              },
              {
                type: TABLE_BODY_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            id: anySlateElementId,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          scope: "col",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        children: [
                          {
                            text: "1",
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            id: anySlateElementId,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            id: anySlateElementId,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          scope: "col",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: true,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 2,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            id: anySlateElementId,
            rowHeaders: true,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          id: "00",
                          rowspan: 1,
                          scope: "col",
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          id: "01",
                          rowspan: 1,
                          scope: "col",
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          id: "r1",
                          colspan: 1,
                          rowspan: 2,
                          scope: "row",
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          headers: "01 r1",
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          headers: "01 r1",
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Make sure row headers and table headers are set correctly when rowHeaders=false", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          headers: "00",
                          colspan: 1,
                          rowspan: 2,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          headers: "01",
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
                    type: TABLE_ROW_ELEMENT_TYPE,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            id: anySlateElementId,
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    text: "",
                  },
                ],
              },
              {
                type: TABLE_HEAD_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          id: "00",
                          colspan: 1,
                          rowspan: 1,
                          scope: "col",
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "1",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          id: "01",
                          colspan: 1,
                          rowspan: 1,
                          scope: "col",
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
                type: TABLE_BODY_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          headers: "00",
                          colspan: 1,
                          rowspan: 2,
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "3",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          align: "right",
                          headers: "01",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
                    type: TABLE_ROW_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        id: anySlateElementId,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          headers: "01",
                          align: "right",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            id: anySlateElementId,
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
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
