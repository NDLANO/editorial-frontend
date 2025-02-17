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
import { ASIDE_ELEMENT_TYPE } from "../asideTypes";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: "" }] },

      {
        type: ASIDE_ELEMENT_TYPE,
        data: { type: "factAside" },
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: "" }] },

      {
        type: ASIDE_ELEMENT_TYPE,
        data: { type: "factAside" },
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
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
