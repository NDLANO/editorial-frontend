/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate } from "@ndla/editor";
import { frontpagePlugins } from "../../../../../containers/ArticlePage/FrontpageArticlePage/components/frontpagePlugins";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { GRID_ELEMENT_TYPE, GRID_CELL_ELEMENT_TYPE } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: frontpagePlugins });

describe("normalizing grid tests", () => {
  test("column of two should have only two cells", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: GRID_ELEMENT_TYPE,
            data: {
              columns: "2",
              border: "none",
            },
            children: [
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
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
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "a" }] }],
              },
            ],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("four cell column should have four cells", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: GRID_ELEMENT_TYPE,
            data: {
              columns: "4",
              border: "none",
            },
            children: [
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
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
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "a" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] }],
              },
              {
                type: GRID_CELL_ELEMENT_TYPE,
                id: anySlateElementId,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] }],
              },
            ],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
