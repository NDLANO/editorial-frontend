/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_FRAMED_CONTENT } from "../../framedContent/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_DISCLAIMER } from "../types";

describe("disclaimer with content serializing tests", () => {
  const editorContent: Descendant[] = [
    {
      type: TYPE_DISCLAIMER,
      data: { resource: "uu-disclaimer", disclaimer: "disclaimer text" },
      children: [
        {
          type: TYPE_SECTION,
          children: [
            { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
            {
              type: TYPE_FRAMED_CONTENT,
              children: [{ type: TYPE_PARAGRAPH, children: [{ text: "content" }] }],
            },
            { type: TYPE_PARAGRAPH, children: [{ text: "" }] },
          ],
        },
      ],
    },
  ];

  const htmlContent =
    '<ndlaembed data-resource="uu-disclaimer" data-disclaimer="disclaimer text"><section><div data-type="framed-content"><p>content</p></div></section></ndlaembed>';

  test("serializing", () => {
    const res = blockContentToHTML(editorContent);
    expect(res).toMatch(htmlContent);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(htmlContent);
    expect(res).toEqual(editorContent);
  });
});

describe("disclaimer without content serializing tests", () => {
  const editorEmpty: Descendant[] = [
    {
      type: TYPE_DISCLAIMER,
      data: { resource: "uu-disclaimer", disclaimer: "disclaimer text" },
      children: [{ text: "" }],
    },
  ];

  const htmlEmpty = '<ndlaembed data-resource="uu-disclaimer" data-disclaimer="disclaimer text"></ndlaembed>';

  test("serializing", () => {
    const res = blockContentToHTML(editorEmpty);
    expect(res).toMatch(htmlEmpty);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(htmlEmpty);
    expect(res).toEqual(editorEmpty);
  });
});
