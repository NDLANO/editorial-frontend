/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_COMMENT_BLOCK } from "../block/types";
import { TYPE_COMMENT_INLINE } from "../inline/types";

describe("inline comment serializing tests", () => {
  const editor: Descendant[] = [
    {
      type: TYPE_SECTION,
      children: [
        {
          type: TYPE_PARAGRAPH,
          children: [
            { text: "This is a " },
            {
              type: TYPE_COMMENT_INLINE,
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
      type: TYPE_COMMENT_BLOCK,
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
