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

// TODO: Maybe consider adding tests for multiple header rows? Not sure if needed

describe("table container normalizer", () => {
  it("should automatically wrap non-row elements in row", () => {
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
                type: TABLE_CELL_HEADER_ELEMENT_TYPE,
                id: anySlateElementId,
                data: { colspan: 1, rowspan: 1, scope: "col" },
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [{ text: "" }],
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
                    data: { colspan: 1, rowspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "" }],
                      },
                    ],
                  },
                ],
              },
              {
                type: TABLE_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: { colspan: 1, rowspan: 1 },
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [{ text: "" }],
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
                    data: { colspan: 1, rowspan: 1, scope: "col" },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "" }],
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
                    data: { colspan: 1, rowspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "" }],
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
                    data: { colspan: 1, rowspan: 1 },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [{ text: "" }],
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
