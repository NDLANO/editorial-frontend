/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { LINK_ELEMENT_TYPE, CONTENT_LINK_ELEMENT_TYPE } from "../types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("link normalizer tests", () => {
  test("Remove any elements in links", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [
              { text: "" },
              {
                type: LINK_ELEMENT_TYPE,
                data: {
                  href: "test-url",
                },
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    children: [{ text: "illegal block" }],
                  },
                ],
              },
              { text: "" },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              { text: "" },
              {
                type: LINK_ELEMENT_TYPE,
                data: {
                  href: "test-url",
                },
                children: [{ text: "illegal block" }],
              },
              { text: "" },
            ],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("content link text keeps styling", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [
              { text: "" },
              {
                type: CONTENT_LINK_ELEMENT_TYPE,
                data: {
                  resource: CONTENT_LINK_ELEMENT_TYPE,
                  contentId: "123",
                  contentType: "article",
                  openIn: "current-context",
                },
                children: [{ bold: true, italic: true, text: "content" }],
              },
              { text: "" },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              { text: "" },
              {
                type: CONTENT_LINK_ELEMENT_TYPE,
                data: {
                  resource: CONTENT_LINK_ELEMENT_TYPE,
                  contentId: "123",
                  contentType: "article",
                  openIn: "current-context",
                },
                children: [{ bold: true, italic: true, text: "content" }],
              },
              { text: "" },
            ],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Remove empty links", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [
              { text: "" },
              {
                type: LINK_ELEMENT_TYPE,
                data: {
                  href: "test-url",
                },
                children: [
                  {
                    text: "",
                  },
                ],
              },
              { text: "" },
              {
                type: CONTENT_LINK_ELEMENT_TYPE,
                data: {
                  resource: CONTENT_LINK_ELEMENT_TYPE,
                  contentType: "test",
                  contentId: "123",
                  openIn: "test",
                },
                children: [
                  {
                    text: "",
                  },
                ],
              },
              { text: "" },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
