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
import { TYPE_LINK, TYPE_CONTENT_LINK } from "../types";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_PARAGRAPH,
        children: [
          { text: "" },
          {
            type: TYPE_LINK,
            data: {
              href: "http://test.url/",
              rel: undefined,
              target: undefined,
              title: undefined,
            },
            children: [
              {
                text: "link",
              },
            ],
          },
          { text: "" },
        ],
      },
      {
        type: TYPE_PARAGRAPH,
        children: [
          { text: "" },
          {
            type: TYPE_CONTENT_LINK,
            data: {
              resource: TYPE_CONTENT_LINK,
              contentId: "123",
              contentType: "article",
              openIn: "new-context",
            },
            children: [
              {
                text: "content-link",
              },
            ],
          },
          { text: "" },
        ],
      },
    ],
  },
];

const html =
  '<section><p><a href="http://test.url/">link</a></p><p><ndlaembed data-content-id="123" data-open-in="new-context" data-resource="content-link" data-content-type="article">content-link</ndlaembed></p></section>';
describe("link serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
