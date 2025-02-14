/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContentTypes";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
      {
        type: FRAMED_CONTENT_ELEMENT_TYPE,
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
    ],
  },
];

describe("framedContent serializing tests", () => {
  test("serializing", () => {
    const html = '<section><div data-type="framed-content"><p>content</p></div></section>';
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const html = '<section><div data-type="framed-content"><p>content</p></div></section>';
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
