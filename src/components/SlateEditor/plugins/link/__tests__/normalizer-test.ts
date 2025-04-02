/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_LINK, TYPE_CONTENT_LINK } from "../types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("link normalizer tests", () => {
  test("Remove any elements in links", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: "" },
              {
                type: TYPE_LINK,
                data: {
                  href: "test-url",
                },
                children: [
                  {
                    type: TYPE_PARAGRAPH,
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
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: "" },
              {
                type: TYPE_LINK,
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
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: "" },
              {
                type: TYPE_CONTENT_LINK,
                data: {
                  resource: TYPE_CONTENT_LINK,
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
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: "" },
              {
                type: TYPE_CONTENT_LINK,
                data: {
                  resource: TYPE_CONTENT_LINK,
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
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: "" },
              {
                type: TYPE_LINK,
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
                type: TYPE_CONTENT_LINK,
                data: {
                  resource: TYPE_CONTENT_LINK,
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
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
