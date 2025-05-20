/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import {
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
} from "../types";
import { defaultTable, tableEditor } from "./tableTestHelpers";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

describe("Table cell normalizer", () => {
  it("should automatically right-align cells that only contain numbers", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
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
                    data: { rowspan: 1, colspan: 1, scope: "col" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "0" }],
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
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Svaret er 1" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
      shouldNormalize: true,
    });
    expect(tableEditor.children).toEqual(
      defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
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
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "0" }],
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
                    data: { rowspan: 1, colspan: 1, align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Svaret er 1" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  });
  it("should not automatically align if align is already set", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
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
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "left" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "0" }],
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
                    data: { rowspan: 1, colspan: 1, align: "left" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Svaret er 1" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
      shouldNormalize: true,
    });
    expect(tableEditor.children).toEqual(
      defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
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
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "left" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "0" }],
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
                    data: { rowspan: 1, colspan: 1, align: "left" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Svaret er 1" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  });
  it("should automatically convert table cells within a table head into table header cells", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
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
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Første" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Andre" }],
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
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Hallo" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Hallo" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
      shouldNormalize: true,
    });
    expect(tableEditor.children).toEqual(
      defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
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
                    data: { rowspan: 1, colspan: 1, scope: "col" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Første" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Andre" }],
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
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Hallo" }],
                      },
                    ],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "Hallo" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  });
});
