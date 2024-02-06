/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_DISCLAIMER } from "../types";

const editor: Descendant[] = [
  {
    type: TYPE_DISCLAIMER,
    data: { resource: "uu-disclaimer", disclaimer: "disclaimer text" },
    children: [{ text: "" }],
  },
];

const html = '<ndlaembed data-resource="uu-disclaimer" data-disclaimer="disclaimer text"></ndlaembed>';

describe("disclaimer serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
