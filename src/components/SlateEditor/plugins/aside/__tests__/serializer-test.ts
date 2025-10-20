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
import { ASIDE_ELEMENT_TYPE } from "../asideTypes";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

      {
        type: ASIDE_ELEMENT_TYPE,
        data: { type: "factAside" },
        children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] }],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

      {
        type: ASIDE_ELEMENT_TYPE,
        data: { type: "factAside" },
        children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] }],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const html =
  '<section><aside data-type="factAside"><p>content</p></aside><aside data-type="factAside"><p>content</p></aside></section>';

describe("aside serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
