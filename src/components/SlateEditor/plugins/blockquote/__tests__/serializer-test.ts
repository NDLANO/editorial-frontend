/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_SECTION } from "../../section/types";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquoteTypes";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: BLOCK_QUOTE_ELEMENT_TYPE,
        children: [{ text: "content" }],
      },
    ],
  },
];

const html = "<section><blockquote>content</blockquote></section>";

describe("blockquote serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
