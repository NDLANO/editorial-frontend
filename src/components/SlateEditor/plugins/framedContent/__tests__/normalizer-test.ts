/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor } from "slate";
import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_HEADING } from "../../heading/types";
import { TYPE_LINK } from "../../link/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_FRAMED_CONTENT } from "../types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("framedContent normalizer tests", () => {
  test("adds paragraphs around framedContent element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraph to empty framedContent element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_FRAMED_CONTENT,
            children: [],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "" }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraph at the end of framedContent with only heading", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_HEADING, level: 1, children: [{ text: "content" }] }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [
              { type: TYPE_HEADING, level: 1, children: [{ text: "content" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
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

  test("unwraps content of wrong type", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_FRAMED_CONTENT,
            children: [
              {
                type: TYPE_LINK,
                data: {
                  href: "testurl",
                },
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
              },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_FRAMED_CONTENT,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
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
