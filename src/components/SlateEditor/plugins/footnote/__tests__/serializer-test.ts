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
import { FOOTNOTE_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        children: [
          {
            text: "text",
          },
          {
            type: FOOTNOTE_ELEMENT_TYPE,
            data: {
              title: "test-title",
              year: "2000",
              resource: "footnote",
              authors: ["test"],
              edition: "1",
              publisher: "test-publisher",
              type: "",
            },
            children: [
              {
                text: "[#]",
              },
            ],
          },
          { text: "" },
        ],
      },
    ],
  },
];

const html =
  '<section><p>text<ndlaembed data-title="test-title" data-year="2000" data-resource="footnote" data-authors="test" data-edition="1" data-publisher="test-publisher" data-type=""></ndlaembed></p></section>';
describe("file serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
