/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";
import {
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
} from "../types";
import { defaultTable, tableEditor } from "./tableTestHelpers";

describe("Table Row Normalizer", () => {
  it("should wrap non-cell children in table cells", () => {
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
                    data: {
                      rowspan: 1,
                      colspan: 1,
                      scope: "col",
                    },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        serializeAsText: true,
                        children: [{ text: "" }],
                        id: anySlateElementId,
                      },
                    ],
                  },
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    serializeAsText: true,
                    children: [{ text: "Hello" }],
                    id: anySlateElementId,
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
                    type: PARAGRAPH_ELEMENT_TYPE,
                    serializeAsText: true,
                    id: anySlateElementId,
                    children: [{ text: "Hello Row 1" }],
                  },
                  {
                    type: TABLE_CELL_ELEMENT_TYPE,
                    id: anySlateElementId,
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        serializeAsText: true,
                        children: [{ text: "Second cell Row 1" }],
                        id: anySlateElementId,
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
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        serializeAsText: true,
                        children: [{ text: "Hello Row 2" }],
                        id: anySlateElementId,
                      },
                    ],
                  },
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    serializeAsText: true,
                    id: anySlateElementId,
                    children: [{ text: "Second cell row 2" }],
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
                    data: {
                      rowspan: 1,
                      colspan: 1,
                      scope: "col",
                    },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        // TODO: Should this be here?
                        // serializeAsText: true,
                        children: [{ text: "" }],
                        id: anySlateElementId,
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
                        // TODO: Should this be here?
                        // serializeAsText: true,
                        children: [{ text: "Hello" }],
                        id: anySlateElementId,
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
                        // TODO: Should this be here?
                        // serializeAsText: true,
                        id: anySlateElementId,
                        children: [{ text: "Hello Row 1" }],
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
                        // TODO: Should this be here?
                        serializeAsText: true,
                        children: [{ text: "Second cell Row 1" }],
                        id: anySlateElementId,
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
                    data: { rowspan: 1, colspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        // TODO: Should this be here?
                        serializeAsText: true,
                        children: [{ text: "Hello Row 2" }],
                        id: anySlateElementId,
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
                        // TODO: Should this be here?
                        // serializeAsText: true,
                        id: anySlateElementId,
                        children: [{ text: "Second cell row 2" }],
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
