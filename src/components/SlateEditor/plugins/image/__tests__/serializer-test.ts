/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../../util/articleContentConverter";
import { IMAGE_ELEMENT_TYPE } from "../../image/types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: IMAGE_ELEMENT_TYPE,
        children: [
          {
            text: "",
          },
        ],
        data: {
          align: " ",
          alt: " ",
          caption: " ",
          resource: "image",
          resourceId: "41176",
          size: "fullbredde",
          url: "https://test123.no",
        },
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

describe("image embed serializing tests", () => {
  test("serializing", () => {
    const emptySectionHtml = "<section></section>";

    const res = inlineContentToHTML(editor);
    expect(res).toMatch(emptySectionHtml);
  });

  test("deserializing", () => {
    const embedHtml =
      '<section><ndlaembed data-resource="image" data-resource_id="41176" data-size="fullbredde" data-align=" " data-alt=" " data-caption=" " data-url="https://test123.no"></ndlaembed></section>';

    const res = inlineContentToEditorValue(embedHtml);
    expect(res).toEqual(editor);
  });
});
