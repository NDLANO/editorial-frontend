/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { frontpagePlugins } from "../../../../../containers/ArticlePage/FrontpageArticlePage/components/frontpagePlugins";
import withPlugins from "../../../utils/withPlugins";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_GRID, TYPE_GRID_CELL } from "../types";

const editor = withHistory(withReact(withPlugins(createEditor(), frontpagePlugins)));

describe("normalizing grid tests", () => {
  test("column of two should have only two cells", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_GRID,
            data: {
              columns: "2",
              border: "none",
            },
            children: [
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: TYPE_GRID_CELL,
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
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_GRID,
            data: {
              columns: "2",
              border: "none",
            },
            children: [
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("four cell column should have four cells", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_GRID,
            data: {
              columns: "4",
              border: "none",
            },
            children: [
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: TYPE_GRID_CELL,
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
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_GRID,
            data: {
              columns: "4",
              border: "none",
            },
            children: [
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "a" }] }],
              },
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "" }] }],
              },
              {
                type: TYPE_GRID_CELL,
                data: { parallaxCell: "false" },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "" }] }],
              },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
