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

describe("Table Normalizer", () => {
  it("automatically inserts a table head if the second child of the table doesn't exist", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
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
                    children: [{ text: "" }],
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  });
  it("accepts a table body as the second child of the table", () => {
    const value = defaultTable({
      value: [
        {
          type: TABLE_CAPTION_ELEMENT_TYPE,
          id: anySlateElementId,
          children: [{ text: "" }],
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
                      serializeAsText: true,
                      children: [{ text: "" }],
                      id: anySlateElementId,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    tableEditor.reinitialize({ value: value, shouldNormalize: true });
    expect(tableEditor.children).toEqual(value);
  });
});
