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
import { CODE_BLOCK_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: CODE_BLOCK_ELEMENT_TYPE,
        data: {
          codeContent: "print(1)",
          codeFormat: "python",
          resource: "code-block",
          title: "tittel",
        },
        children: [{ text: "" }],
        isFirstEdit: false,
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const html =
  '<section><ndlaembed data-code-content="print(1)" data-code-format="python" data-resource="code-block" data-title="tittel"></ndlaembed></section>';

describe("codeblock serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
