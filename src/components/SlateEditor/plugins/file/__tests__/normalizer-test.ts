/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor } from "slate";
import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { FILE_ELEMENT_TYPE } from "../types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("file normalizer tests", () => {
  test("adds paragraphs around file element", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: FILE_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: FILE_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: FILE_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: FILE_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: FILE_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: FILE_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: [],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
