/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import {
  TYPE_TABLE_BODY,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_CELL,
  TYPE_TABLE_CELL_HEADER,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from "../types";
import { defaultTable, tableEditor } from "./tableTestHelpers";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

describe("Table cell normalizer", () => {
  it("should automatically right-align cells that only contain numbers", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL_HEADER,
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
                    type: TYPE_TABLE_CELL_HEADER,
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
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
                    type: TYPE_TABLE_CELL,
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL_HEADER,
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
                    type: TYPE_TABLE_CELL_HEADER,
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
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
                    type: TYPE_TABLE_CELL,
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL_HEADER,
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
                    type: TYPE_TABLE_CELL_HEADER,
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
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
                    type: TYPE_TABLE_CELL,
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL_HEADER,
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
                    type: TYPE_TABLE_CELL_HEADER,
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
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
                    type: TYPE_TABLE_CELL,
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

  it("should wrap text elements in paragraphs", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL_HEADER,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col" },
                    children: [{ text: "1" }],
                  },
                  {
                    type: TYPE_TABLE_CELL_HEADER,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col" },
                    children: [{ text: "0" }],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [{ text: "1" }],
                  },
                  {
                    type: TYPE_TABLE_CELL,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [{ text: "Svaret er 1" }],
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL_HEADER,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        // TODO: Should this be here?
                        // serializeAsText: true,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TYPE_TABLE_CELL_HEADER,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, scope: "col", align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        // TODO: Should this be here?
                        // serializeAsText: true,
                        children: [{ text: "0" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1, align: "right" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        // TODO: Should this be here?
                        serializeAsText: true,
                        children: [{ text: "1" }],
                      },
                    ],
                  },
                  {
                    type: TYPE_TABLE_CELL,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        // TODO: Should this be here?
                        serializeAsText: true,
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
                    type: TYPE_TABLE_CELL,
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
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
                    type: TYPE_TABLE_CELL,
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
          {
            type: TYPE_TABLE_HEAD,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL_HEADER,
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
                    type: TYPE_TABLE_CELL_HEADER,
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
            type: TYPE_TABLE_BODY,
            id: anySlateElementId,
            children: [
              {
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
                    type: TYPE_TABLE_CELL,
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
