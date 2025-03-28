/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../../framedContent/framedContentTypes";
import { COPYRIGHT_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        children: [{ text: "" }],
      },
      {
        type: FRAMED_CONTENT_ELEMENT_TYPE,
        children: [
          {
            type: COPYRIGHT_ELEMENT_TYPE,
            data: {
              resource: "copyright",
              copyright: {
                license: {
                  license: "asda",
                },
                creators: [],
                processors: [],
                rightsholders: [],
                processed: false,
              },
            },
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "hall" }] }],
          },
        ],
      },
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        children: [{ text: "" }],
      },
    ],
  },
];

const html =
  '<section><div data-type="framed-content"><ndlaembed data-resource="copyright" data-copyright="{&#x22;license&#x22;:{&#x22;license&#x22;:&#x22;asda&#x22;},&#x22;creators&#x22;:[],&#x22;processors&#x22;:[],&#x22;rightsholders&#x22;:[],&#x22;processed&#x22;:false}"><p>hall</p></ndlaembed></div></section>';

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
