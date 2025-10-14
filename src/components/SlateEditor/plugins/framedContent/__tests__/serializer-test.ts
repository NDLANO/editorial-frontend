/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContentTypes";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: FRAMED_CONTENT_ELEMENT_TYPE,
        children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] }],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
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
