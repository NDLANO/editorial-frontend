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
import { CONCEPT_INLINE_ELEMENT_TYPE } from "../inline/types";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_PARAGRAPH,
        children: [
          { text: "" },
          {
            type: CONCEPT_INLINE_ELEMENT_TYPE,
            data: {
              contentId: "123",
              resource: "concept",
              type: "inline",
            },
            children: [{ text: "my concept" }],
          },
          { text: "" },
        ],
      },
    ],
  },
];

const html =
  '<section><p><ndlaembed data-content-id="123" data-resource="concept" data-type="inline">my concept</ndlaembed></p></section>';

describe("concept serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
