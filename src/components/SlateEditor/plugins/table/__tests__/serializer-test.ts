/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import {
  TYPE_TABLE,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
  TYPE_TABLE_CELL,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CELL_HEADER,
} from "../types";

describe("table serializing tests", () => {
  test("serializing and deserialize table", () => {
    const editor: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },

          {
            type: TYPE_TABLE,
            rowHeaders: false,
            colgroups: '<colgroup></colgroup><colgroup span="2"></colgroup>',
            children: [
              {
                type: TYPE_TABLE_CAPTION,
                children: [
                  {
                    text: "title",
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
                          scope: "col",
                          id: "00",
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
                          id: "01",
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
                          headers: "00",
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
                          headers: "01",
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
                          headers: "00",
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
                      {
                        type: TYPE_TABLE_CELL,
                        data: {
                          colspan: 1,
                          rowspan: 1,
                          headers: "01",
                        },
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
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
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
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
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },

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
                        type: TYPE_TABLE_CELL_HEADER,
                        data: {
                          colspan: 1,
                          rowspan: 1,
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
                          colspan: 1,
                          rowspan: 2,
                          scope: "row",
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
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
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
