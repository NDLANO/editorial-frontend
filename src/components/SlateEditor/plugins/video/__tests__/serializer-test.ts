/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: BRIGHTCOVE_ELEMENT_TYPE,
        data: {
          resource: "brightcove",
          videoid: "123",
          title: "title",
          url: "url",
          caption: "caption",
          account: "account",
          player: "player",
        },
        children: [{ text: "" }],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const html =
  '<section><ndlaembed data-resource="brightcove" data-videoid="123" data-title="title" data-url="url" data-caption="caption" data-account="account" data-player="player"></ndlaembed></section>';

describe("brightcove serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
