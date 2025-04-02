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
import { MATH_ELEMENT_TYPE } from "../mathTypes";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        children: [
          { text: "" },
          {
            type: MATH_ELEMENT_TYPE,
            data: {
              innerHTML: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn><mn>2</mn></mfrac></math>',
            },
            children: [
              {
                text: "12",
              },
            ],
          },
          { text: "" },
        ],
        type: TYPE_PARAGRAPH,
      },
    ],
  },
];

const html =
  '<section><p><math><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn><mn>2</mn></mfrac></math></math></p></section>';

describe("mathml serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
