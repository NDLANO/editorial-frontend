/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { FILE_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      {
        type: FILE_ELEMENT_TYPE,
        data: [
          {
            resource: "file",
            path: "/files/resources/file1.txt",
            type: "txt",
            title: "test_txt",
            url: "https://api.test.ndla.no/files/resources/file1.txt",
          },
          {
            path: "/files/resources/file2.pdf",
            type: "pdf",
            title: "test_pdf2",
            resource: "file",
            url: "https://api.test.ndla.no/files/resources/file2.pdf",
          },
          {
            path: "/files/resources/file3.pdf",
            type: "pdf",
            title: "test_pdf3",
            resource: "file",
            display: "block",
            url: "https://api.test.ndla.no/files/resources/file3.pdf",
          },
        ],
        children: [{ text: "" }],
      },
      { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
    ],
  },
];

const html =
  '<section><div data-type="file"><ndlaembed data-resource="file" data-path="/files/resources/file1.txt" data-type="txt" data-title="test_txt" data-url="https://api.test.ndla.no/files/resources/file1.txt"></ndlaembed><ndlaembed data-path="/files/resources/file2.pdf" data-type="pdf" data-title="test_pdf2" data-resource="file" data-url="https://api.test.ndla.no/files/resources/file2.pdf"></ndlaembed><ndlaembed data-path="/files/resources/file3.pdf" data-type="pdf" data-title="test_pdf3" data-resource="file" data-display="block" data-url="https://api.test.ndla.no/files/resources/file3.pdf"></ndlaembed></div></section>';

describe("file serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
