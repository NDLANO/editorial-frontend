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
import { KEY_FIGURE_ELEMENT_TYPE } from "../types";

const html =
  '<section><ndlaembed data-resource="key-figure" data-image-id="65790" data-title="Her erre en test folkens" data-subtitle="Her erre en test folkens"></ndlaembed></section>';

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: KEY_FIGURE_ELEMENT_TYPE,
        data: {
          resource: "key-figure",
          imageId: "65790",
          title: "Her erre en test folkens",
          subtitle: "Her erre en test folkens",
        },
        children: [],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

describe("key performance indicator serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
