/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";
import { TYPE_TABLE_CAPTION, TYPE_TABLE_CELL_HEADER, TYPE_TABLE_HEAD, TYPE_TABLE_ROW } from "../types";
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
            type: TYPE_TABLE_CAPTION,
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
            type: TYPE_TABLE_CAPTION,
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "helloworld" }],
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "hello", bold: true, code: true, italic: true, sub: true, sup: true, underlined: true }],
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
            type: TYPE_TABLE_CAPTION,
            id: anySlateElementId,
            children: [{ text: "hello" }],
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
