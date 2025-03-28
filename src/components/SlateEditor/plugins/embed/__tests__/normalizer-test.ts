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
import { AUDIO_ELEMENT_TYPE } from "../../audio/audioTypes";
import { H5P_ELEMENT_TYPE } from "../../h5p/types";
import { TYPE_IMAGE } from "../../image/types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("embed normalizer tests", () => {
  test("adds paragraphs around embed", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: TYPE_IMAGE,
            children: [
              {
                text: "",
              },
            ],
            data: {
              resource: "image",
              resourceId: "123",
              size: "small",
              align: "right",
              alt: "test-alt",
              caption: "test-caption",
              url: "https://test.url",
            },
          },
          {
            type: H5P_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: {
              resource: "h5p",
              url: "https://test.url",
              path: "test/path",
            },
          },
          {
            type: AUDIO_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: {
              resource: "audio",
              resourceId: "123",
              type: "standard",
              url: "https://test.url",
            },
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
            type: TYPE_IMAGE,
            children: [
              {
                text: "",
              },
            ],
            data: {
              resource: "image",
              resourceId: "123",
              size: "small",
              align: "right",
              alt: "test-alt",
              caption: "test-caption",
              url: "https://test.url",
            },
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: H5P_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: {
              resource: "h5p",
              url: "https://test.url",
              path: "test/path",
            },
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: AUDIO_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
            data: {
              resource: "audio",
              resourceId: "123",
              type: "standard",
              url: "https://test.url",
            },
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
