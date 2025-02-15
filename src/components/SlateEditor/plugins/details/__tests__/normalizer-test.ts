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
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_SPAN } from "../../span/types";
import { TYPE_DETAILS, TYPE_SUMMARY } from "../types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("details normalizer tests", () => {
  test("adds paragraphs around details element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
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
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
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

  test("adds summary and paragraph to empty details element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_DETAILS,
            children: [],
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
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "" }] },
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

  test("adds paragraph at the end of details with only summary", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_DETAILS,
            children: [{ type: TYPE_SUMMARY, children: [{ text: "title" }] }],
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
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
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

  test("unwraps summary and rewraps it as paragraph if placed elsewhere", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_SUMMARY, children: [{ text: "wrong" }] },
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
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: "title" }] },
              { type: TYPE_PARAGRAPH, children: [{ text: "wrong" }] },
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

  test("change summary node to paragraph if not child of details element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [{ type: TYPE_SUMMARY, children: [{ text: "title" }] }],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: "title" }] }],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("allow header element inside summary", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "upper" }] },
          {
            type: TYPE_DETAILS,
            children: [
              {
                type: TYPE_SUMMARY,
                children: [{ type: TYPE_HEADING, level: 2, children: [{ text: "title" }] }],
              },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "lower" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "upper" }] },
          {
            type: TYPE_DETAILS,
            children: [
              {
                type: TYPE_SUMMARY,
                children: [{ type: TYPE_HEADING, level: 2, children: [{ text: "title" }] }],
              },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "lower" }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("allow paragraph element inside summary", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "upper" }] },
          {
            type: TYPE_DETAILS,
            children: [
              {
                type: TYPE_SUMMARY,
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: "title" }] }],
              },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "lower" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "upper" }] },
          {
            type: TYPE_DETAILS,
            children: [
              {
                type: TYPE_SUMMARY,
                children: [{ type: TYPE_PARAGRAPH, serializeAsText: true, children: [{ text: "title" }] }],
              },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "lower" }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("allow span element inside summary", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "upper" }] },
          {
            type: TYPE_DETAILS,
            children: [
              {
                type: TYPE_SUMMARY,
                children: [{ type: TYPE_SPAN, data: {}, children: [{ text: "title" }] }],
              },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "lower" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: "upper" }] },
          {
            type: TYPE_DETAILS,
            children: [
              {
                type: TYPE_SUMMARY,
                children: [{ text: "" }, { type: TYPE_SPAN, data: {}, children: [{ text: "title" }] }, { text: "" }],
              },
              { type: TYPE_PARAGRAPH, children: [{ text: "content" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: "lower" }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
