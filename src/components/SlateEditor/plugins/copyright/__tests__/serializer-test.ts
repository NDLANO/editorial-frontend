/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../../framedContent/framedContentTypes";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_COPYRIGHT } from "../types";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_PARAGRAPH,
        children: [{ text: "" }],
      },
      {
        type: FRAMED_CONTENT_ELEMENT_TYPE,
        children: [
          {
            type: TYPE_COPYRIGHT,
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
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: "hall" }] }],
          },
        ],
      },
      {
        type: TYPE_PARAGRAPH,
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
