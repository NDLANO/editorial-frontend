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
import { RELATED_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: RELATED_ELEMENT_TYPE,
        data: [
          {
            resource: "related-content",
            articleId: "123",
          },
          {
            resource: "related-content",
            url: "http://google.com",
            title: "test-title",
          },
        ],
        children: [
          {
            text: "",
          },
        ],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const html =
  '<section><div data-type="related-content"><ndlaembed data-resource="related-content" data-article-id="123"></ndlaembed><ndlaembed data-resource="related-content" data-url="http://google.com" data-title="test-title"></ndlaembed></div></section>';

describe("related serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
