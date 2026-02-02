/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { SPAN_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        children: [
          { text: "" },
          { type: SPAN_ELEMENT_TYPE, data: { lang: "en" }, children: [{ text: "test" }] },
          { text: "" },
        ],
      },
    ],
  },
];

const html = '<section><p><span lang="en">test</span></p></section>';
const htmlWithoutAttributes = "<section><p><span>test</span></p></section>";
const hmtlWithoutSpan = "<section><p>test</p></section>";

describe("span serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("serializing unwraps span without attributes", () => {
    const editorWithoutAttributes: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [
              { text: "" },
              {
                type: SPAN_ELEMENT_TYPE,
                data: {},
                children: [{ text: "test" }, { text: "" }],
              },
            ],
          },
        ],
      },
    ];

    const res = blockContentToHTML(editorWithoutAttributes);
    expect(res).toMatch(hmtlWithoutSpan);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });

  test("deserializing handles span without attributes", () => {
    const editorWithoutSpan: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "test" }],
          },
        ],
      },
    ];

    const res = blockContentToEditorValue(htmlWithoutAttributes);
    expect(res).toEqual(editorWithoutSpan);
  });
});
