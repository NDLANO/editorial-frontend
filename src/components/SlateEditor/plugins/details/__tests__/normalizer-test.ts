/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor } from "slate";
import { createSlate, HEADING_ELEMENT_TYPE, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_SPAN } from "../../span/types";
import { DETAILS_ELEMENT_TYPE } from "../detailsTypes";
import { SUMMARY_ELEMENT_TYPE } from "../summaryTypes";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("details normalizer tests", () => {
  test("adds paragraphs around details element", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              {
                type: SUMMARY_ELEMENT_TYPE,
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true, children: [{ text: "" }] }],
              },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [{ type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] }],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "wrong" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              { type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "wrong" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
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
        type: SECTION_ELEMENT_TYPE,
        children: [{ type: SUMMARY_ELEMENT_TYPE, children: [{ text: "title" }] }],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "title" }] }],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("allow header element inside summary", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "upper" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              {
                type: SUMMARY_ELEMENT_TYPE,
                children: [{ type: HEADING_ELEMENT_TYPE, level: 2, children: [{ text: "title" }] }],
              },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "lower" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "upper" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              {
                type: SUMMARY_ELEMENT_TYPE,
                children: [{ type: HEADING_ELEMENT_TYPE, level: 2, children: [{ text: "title" }] }],
              },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "lower" }] },
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "upper" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              {
                type: SUMMARY_ELEMENT_TYPE,
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "title" }] }],
              },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "lower" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "upper" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              {
                type: SUMMARY_ELEMENT_TYPE,
                children: [{ type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true, children: [{ text: "title" }] }],
              },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "lower" }] },
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "upper" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              {
                type: SUMMARY_ELEMENT_TYPE,
                children: [{ type: TYPE_SPAN, data: {}, children: [{ text: "title" }] }],
              },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "lower" }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "upper" }] },
          {
            type: DETAILS_ELEMENT_TYPE,
            children: [
              {
                type: SUMMARY_ELEMENT_TYPE,
                children: [{ text: "" }, { type: TYPE_SPAN, data: {}, children: [{ text: "title" }] }, { text: "" }],
              },
              { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
            ],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "lower" }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
