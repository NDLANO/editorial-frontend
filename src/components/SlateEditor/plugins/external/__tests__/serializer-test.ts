/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { EXTERNAL_ELEMENT_TYPE } from "../types";

describe("external serializer", () => {
  const editorWithYoutube: Descendant[] = [
    {
      type: SECTION_ELEMENT_TYPE,
      children: [
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        {
          type: EXTERNAL_ELEMENT_TYPE,
          children: [
            {
              text: "",
            },
          ],
          data: {
            resource: "external",
            url: "https://www.youtube.com/watch?v=123",
          },
        },
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      ],
    },
  ];

  const htmlWithYoutube =
    '<section><ndlaembed data-resource="external" data-url="https://www.youtube.com/watch?v=123"></ndlaembed></section>';

  test("serializing youtube", () => {
    const res = blockContentToHTML(editorWithYoutube);
    expect(res).toMatch(htmlWithYoutube);
  });

  test("deserializing youtube", () => {
    const res = blockContentToEditorValue(htmlWithYoutube);
    expect(res).toEqual(editorWithYoutube);
  });
});
