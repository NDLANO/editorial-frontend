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
import { TYPE_HEADING } from "../../heading/types";
import { LINK_ELEMENT_TYPE } from "../../link/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { ASIDE_ELEMENT_TYPE } from "../asideTypes";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("aside normalizer tests", () => {
  test("adds paragraphs around aside element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
          },
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
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraphs to empty aside element", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [],
          },
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
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraph at the end of aside with only heading", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [{ type: TYPE_HEADING, level: 1, children: [{ text: "content" }] }],
          },
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
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [
              { type: TYPE_HEADING, id: anySlateElementId, level: 1, children: [{ text: "content" }] },
              { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
            ],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("unwraps content of wrong type", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: ASIDE_ELEMENT_TYPE,
            data: { type: "factAside" },
            children: [
              {
                type: LINK_ELEMENT_TYPE,
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
        id: anySlateElementId,
        children: [
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
          {
            type: ASIDE_ELEMENT_TYPE,
            id: anySlateElementId,
            data: { type: "factAside" },
            children: [{ type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "content" }] }],
          },
          { type: TYPE_PARAGRAPH, id: anySlateElementId, children: [{ text: "" }] },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
