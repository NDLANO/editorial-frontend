/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_EMBED_BRIGHTCOVE } from "../types";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
      {
        type: TYPE_EMBED_BRIGHTCOVE,
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
      { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
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
