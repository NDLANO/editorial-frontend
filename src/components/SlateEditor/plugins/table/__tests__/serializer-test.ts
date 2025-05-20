/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import {
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
} from "../types";

describe("table serializing tests", () => {
  test("serializing and deserialize table", () => {
    const editor: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TABLE_CAPTION_ELEMENT_TYPE,
                children: [
                  {
                    text: "title",
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
                          scope: "col",
                          id: "00",
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
                          scope: "col",
                          id: "01",
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
                          headers: "00",
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
                          headers: "01",
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
                          headers: "00",
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
                      {
                        type: TABLE_CELL_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          headers: "01",
                        },
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "6",
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
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const html =
      '<section><table><caption>title</caption><colgroup></colgroup><colgroup span="2"></colgroup><thead><tr><th scope="col" id="00"><p>1</p></th><th scope="col" id="01"><p>2</p></th></tr></thead><tbody><tr><td headers="00"><p>3</p></td><td headers="01"><p>4</p></td></tr><tr><td headers="00"><p>5</p></td><td headers="01"><p>6</p></td></tr></tbody></table></section>';

    const serialized = blockContentToHTML(editor);
    expect(serialized).toMatch(html);

    const deserialized = blockContentToEditorValue(html);
    expect(deserialized).toEqual(editor);
  });

  test("seriaize and deserialize table with row headers", () => {
    const editor: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

          {
            type: TABLE_ELEMENT_TYPE,
            rowHeaders: true,
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
                          scope: "col",
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
                          scope: "col",
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
                        type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                        data: {
                          colspan: 1,
                          rowspan: 2,
                          scope: "row",
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
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const html =
      '<section><table><colgroup></colgroup><colgroup span="2"></colgroup><thead><tr><th scope="col"><p>1</p></th><th scope="col"><p>2</p></th></tr></thead><tbody><tr><th rowspan="2" scope="row"><p>3</p></th><td><p>4</p></td></tr><tr><td><p>5</p></td></tr></tbody></table></section>';

    const serialized = blockContentToHTML(editor);
    expect(serialized).toMatch(html);

    const deserialized = blockContentToEditorValue(html);
    expect(deserialized).toEqual(editor);
  });
});
