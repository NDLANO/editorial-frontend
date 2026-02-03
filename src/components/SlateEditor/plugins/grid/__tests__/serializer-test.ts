/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { GRID_ELEMENT_TYPE, GRID_CELL_ELEMENT_TYPE } from "../types";

const editor2: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: GRID_ELEMENT_TYPE,
        data: {
          columns: "2",
          border: "lightBlue",
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

const html2 =
  '<section><div data-type="grid" data-columns="2" data-border="lightBlue"><div data-type="grid-cell"><p>a</p></div><div data-type="grid-cell"><p>a</p></div></div></section>';

const editor4: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: GRID_ELEMENT_TYPE,
        data: {
          columns: "4",
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

const html4 =
  '<section><div data-type="grid" data-columns="4"><div data-type="grid-cell"><p>a</p></div><div data-type="grid-cell"><p>a</p></div><div data-type="grid-cell"><p>a</p></div><div data-type="grid-cell"><p>a</p></div></div></section>';

const editorMultipleChildrenGridCell: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: GRID_ELEMENT_TYPE,
        data: {
          columns: "4",
        },
        children: [
          {
            type: GRID_CELL_ELEMENT_TYPE,
            data: {},
            children: [
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
            ],
          },
          {
            type: GRID_CELL_ELEMENT_TYPE,
            data: {},
            children: [
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
            ],
          },
          {
            type: GRID_CELL_ELEMENT_TYPE,
            data: { border: "true" },
            children: [
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
            ],
          },
          {
            type: GRID_CELL_ELEMENT_TYPE,
            data: {},
            children: [
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "a" }] },
            ],
          },
        ],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const htmlMultipleChildrenGridCell =
  '<section><div data-type="grid" data-columns="4"><div data-type="grid-cell"><p>a</p><p>a</p></div><div data-type="grid-cell"><p>a</p><p>a</p><p>a</p></div><div data-type="grid-cell" data-border="true"><p>a</p><p>a</p></div><div data-type="grid-cell"><p>a</p><p>a</p><p>a</p></div></div></section>';

describe("grid serializing tests", () => {
  test("serializing 2x1 grid", () => {
    const res = blockContentToHTML(editor2);
    expect(res).toMatch(html2);
  });

  test("deserializing 2x1 grid", () => {
    const res = blockContentToEditorValue(html2);
    expect(res).toMatchObject(editor2);
  });

  test("serializing 4x1 grid", () => {
    const res = blockContentToHTML(editor4);
    expect(res).toMatch(html4);
  });

  test("deserializing 4x1 grid", () => {
    const res = blockContentToEditorValue(html4);
    expect(res).toMatchObject(editor4);
  });

  test("serializing multiple children inside grid_cell", () => {
    const res = blockContentToEditorValue(htmlMultipleChildrenGridCell);
    expect(res).toMatchObject(editorMultipleChildrenGridCell);
  });

  test("deserializing multiple children inside grid_cell", () => {
    const res = blockContentToHTML(editorMultipleChildrenGridCell);
    expect(res).toMatch(htmlMultipleChildrenGridCell);
  });
});
