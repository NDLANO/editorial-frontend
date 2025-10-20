/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionListTypes";
import { SECTION_ELEMENT_TYPE } from "@ndla/editor";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      {
        type: DEFINITION_LIST_ELEMENT_TYPE,
        children: [
          {
            type: DEFINITION_TERM_ELEMENT_TYPE,
            children: [{ text: "Tester vi testesen" }],
          },
          {
            type: DEFINITION_DESCRIPTION_ELEMENT_TYPE,
            children: [
              {
                text: "En test er en test vi tester for å teste om testingen gir test resultater",
              },
            ],
          },
        ],
      },
    ],
  },
];

const html =
  "<section><dl><dt>Tester vi testesen</dt><dd>En test er en test vi tester for å teste om testingen gir test resultater</dd></dl></section>";

describe("definition serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
