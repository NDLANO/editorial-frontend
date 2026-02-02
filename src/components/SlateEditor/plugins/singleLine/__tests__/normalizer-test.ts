/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate, LoggerManager, NOOP_ELEMENT_TYPE, PARAGRAPH_ELEMENT_TYPE, spanPlugin } from "@ndla/editor";
import { Descendant } from "slate";
import { singleLinePlugin } from "..";
import { noopPlugin } from "../../noop";
import { paragraphPlugin } from "../../paragraph";

const plugins = [paragraphPlugin, noopPlugin, singleLinePlugin, spanPlugin];

describe("single line normalizer", () => {
  it("should merge nodes with more than one child", () => {
    const value: Descendant[] = [
      {
        type: NOOP_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            serializeAsText: true,
            children: [{ text: "First line" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            serializeAsText: true,
            children: [{ text: "Second line", bold: true }],
          },
        ],
      },
    ];

    const expected: Descendant[] = [
      {
        type: NOOP_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            serializeAsText: true,
            children: [{ text: "First line" }, { text: "Second line", bold: true }],
          },
        ],
      },
    ];
    const editor = createSlate({ plugins, value, shouldNormalize: true });
    expect(editor.children).toEqual(expected);
  });

  it("should remove everything but the first root node", () => {
    const value: Descendant[] = [
      {
        type: NOOP_ELEMENT_TYPE,
        children: [{ type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true, children: [{ text: "First line" }] }],
      },
      {
        type: NOOP_ELEMENT_TYPE,
        children: [{ type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true, children: [{ text: "Second line" }] }],
      },
    ];

    const expected: Descendant[] = [
      {
        type: NOOP_ELEMENT_TYPE,
        children: [{ type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true, children: [{ text: "First line" }] }],
      },
    ];

    const editor = createSlate({ plugins, value, shouldNormalize: true });
    expect(editor.children).toEqual(expected);
  });
  it("should correctly handle language tags", () => {
    const value: Descendant[] = [
      {
        type: NOOP_ELEMENT_TYPE,
        children: [
          { text: "Test" },
          { type: "span", children: [{ text: " with " }], data: { lang: "en" } },
          { text: "language tag" },
        ],
      },
    ];

    const editor = createSlate({ plugins, value, shouldNormalize: true });
    expect(editor.children).toEqual(value);
  });
  it("should correctly handle mixed content", () => {
    const value: Descendant[] = [
      {
        type: NOOP_ELEMENT_TYPE,
        children: [
          { text: "Test" },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "And a paragraph" }] },
          { type: "span", children: [{ text: " with " }], data: { lang: "en" } },
          { text: "language tag" },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "And a paragraph" }] },
        ],
      },
    ];

    const expected: Descendant[] = [
      {
        type: NOOP_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            serializeAsText: true,
            children: [
              { text: "TestAnd a paragraph" },
              { type: "span", children: [{ text: " with " }], data: { lang: "en" } },
              { text: "language tagAnd a paragraph" },
            ],
          },
        ],
      },
    ];

    const editor = createSlate({ plugins, value, shouldNormalize: true, logger: new LoggerManager({ debug: true }) });
    expect(editor.children).toEqual(expected);
  });
});
