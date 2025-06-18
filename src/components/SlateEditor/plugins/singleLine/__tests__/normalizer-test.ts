/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate, NOOP_ELEMENT_TYPE, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { paragraphPlugin } from "../../paragraph";
import { noopPlugin } from "../../noop";
import { singleLinePlugin } from "..";

const plugins = [paragraphPlugin, noopPlugin, singleLinePlugin];

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
});
