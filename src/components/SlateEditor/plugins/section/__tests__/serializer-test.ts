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
import { TYPE_SECTION } from "../types";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [{ type: TYPE_PARAGRAPH, children: [{ text: "123" }] }],
  },
  {
    type: TYPE_SECTION,
    children: [{ type: TYPE_PARAGRAPH, children: [{ text: "abc" }] }],
  },
];

const html = "<section><p>123</p></section><section><p>abc</p></section>";

describe("section serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });

  test("create empty <section> if html is undefined or empty string", () => {
    const expected = [
      {
        type: TYPE_SECTION,
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: "" }] }],
      },
    ];

    const res1 = blockContentToEditorValue("");
    expect(res1).toEqual(expected);
  });
});
