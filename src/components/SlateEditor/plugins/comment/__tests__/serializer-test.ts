/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../block/types";
import { COMMENT_INLINE_ELEMENT_TYPE } from "../inline/types";

describe("inline comment serializing tests", () => {
  const editor: Descendant[] = [
    {
      type: SECTION_ELEMENT_TYPE,
      children: [
        {
          type: PARAGRAPH_ELEMENT_TYPE,
          children: [
            { text: "This is a " },
            {
              type: COMMENT_INLINE_ELEMENT_TYPE,
              data: { resource: "comment", type: "inline", text: "Comment text" },
              children: [{ text: "comment" }],
            },
            { text: "" },
          ],
        },
      ],
    },
  ];

  const htmlInline =
    '<section><p>This is a <ndlaembed data-resource="comment" data-type="inline" data-text="Comment text">comment</ndlaembed></p></section>';

  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(htmlInline);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(htmlInline);
    expect(res).toEqual(editor);
  });
});

describe("block comment serializing tests", () => {
  const editor: Descendant[] = [
    {
      type: COMMENT_BLOCK_ELEMENT_TYPE,
      data: { resource: "comment", type: "block", text: "Comment text" },
      children: [{ text: "" }],
    },
  ];

  const htmlBlock = '<ndlaembed data-resource="comment" data-type="block" data-text="Comment text"></ndlaembed>';

  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(htmlBlock);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(htmlBlock);
    expect(res).toEqual(editor);
  });
});
