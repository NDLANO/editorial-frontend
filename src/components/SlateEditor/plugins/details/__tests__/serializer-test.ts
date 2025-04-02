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
import { DETAILS_ELEMENT_TYPE } from "../detailsTypes";
import { SUMMARY_ELEMENT_TYPE } from "../summaryTypes";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

      {
        type: DETAILS_ELEMENT_TYPE,
        children: [
          {
            type: SUMMARY_ELEMENT_TYPE,
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true, children: [{ text: "title" }] }],
          },
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "content" }] },
        ],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const html = "<section><details><summary>title</summary><p>content</p></details></section>";

describe("details serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
