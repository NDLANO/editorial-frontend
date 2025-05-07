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
  TYPE_TABLE_BODY,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_CELL,
  TYPE_TABLE_CELL_HEADER,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from "../types";
import { defaultTable, tableEditor } from "./tableTestHelpers";

// TODO: Maybe consider adding tests for multiple header rows? Not sure if needed

describe("table container normalizer", () => {
  it("should automatically wrap non-row elements in row", () => {
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
                type: TYPE_TABLE_CELL_HEADER,
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
                type: TYPE_TABLE_CELL,
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
                type: TYPE_TABLE_ROW,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_TABLE_CELL,
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
