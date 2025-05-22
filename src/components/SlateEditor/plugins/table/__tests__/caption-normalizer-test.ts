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
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
} from "../types";
import { defaultTable, tableEditor } from "./tableTestHelpers";

describe("Table caption normalizer", () => {
  it("should automatically insert a caption if the table is empty", () => {
    tableEditor.reinitialize({
      value: defaultTable({ value: [] }),
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
  it("should remove captions that are not the first child, and automatically insert a new caption at the start of the array if it doesn't exist", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
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
                        id: anySlateElementId,
                        serializeAsText: true,
                        children: [{ text: "" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "hello" }],
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
                        id: anySlateElementId,
                        // TODO: This should probably be here
                        // serializeAsText: true,
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
  it("should remove non-text children from the caption", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "hello" }] },
              {
                type: "content-link",
                id: anySlateElementId,
                data: { resource: "content-link", contentId: "1" },
                children: [{ text: "world" }],
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
                      rowspan: 1,
                      colspan: 1,
                      scope: "col",
                    },
                    children: [
                      {
                        type: PARAGRAPH_ELEMENT_TYPE,
                        id: anySlateElementId,
                        serializeAsText: true,
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
      shouldNormalize: true,
    });
    expect(tableEditor.children).toEqual(
      defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "helloworld" }],
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
                        id: anySlateElementId,
                        // TODO: This should probably be here
                        // serializeAsText: true,
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

  it("should remove marks from the caption", () => {
    tableEditor.reinitialize({
      value: defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "hello", bold: true, code: true, italic: true, sub: true, sup: true, underlined: true }],
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
                        id: anySlateElementId,
                        serializeAsText: true,
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
      shouldNormalize: true,
    });
    expect(tableEditor.children).toEqual(
      defaultTable({
        value: [
          {
            type: TABLE_CAPTION_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "hello" }],
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
                        id: anySlateElementId,
                        // TODO: This should probably be here
                        // serializeAsText: true,
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
