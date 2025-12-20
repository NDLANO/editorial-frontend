/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { frontpagePlugins } from "../../../../../containers/ArticlePage/FrontpageArticlePage/components/frontpagePlugins";
import { GRID_ELEMENT_TYPE, GRID_CELL_ELEMENT_TYPE } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: frontpagePlugins });

describe("normalizing grid tests", () => {
  test("column of two should have only two cells", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: GRID_ELEMENT_TYPE,
            data: {
              columns: "2",
              border: "none",
            },
            children: [
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] }],
              },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: GRID_ELEMENT_TYPE,
            id: anySlateElementId,
            data: {
              columns: "2",
              border: "none",
            },
            children: [
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "a" }] }],
              },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("four cell column should have four cells", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: GRID_ELEMENT_TYPE,
            data: {
              columns: "4",
              border: "none",
            },
            children: [
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] }],
              },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: GRID_ELEMENT_TYPE,
            id: anySlateElementId,
            data: {
              columns: "4",
              border: "none",
            },
            children: [
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: {},
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] }],
              },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
