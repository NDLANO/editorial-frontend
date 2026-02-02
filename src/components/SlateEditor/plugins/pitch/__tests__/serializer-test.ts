/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { PITCH_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: PITCH_ELEMENT_TYPE,
        data: {
          resource: "pitch",
          imageId: "123",
          title: "Min pitch",
          description: "Min beskrivelse",
          url: "https://ndla.no",
        },
        children: [{ text: "" }],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const html =
  '<section><ndlaembed data-resource="pitch" data-image-id="123" data-title="Min pitch" data-description="Min beskrivelse" data-url="https://ndla.no"></ndlaembed></section>';

describe("pitch serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
