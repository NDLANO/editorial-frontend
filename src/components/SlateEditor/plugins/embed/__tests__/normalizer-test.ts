/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor } from "slate";
import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_AUDIO } from "../../audio/types";
import { TYPE_H5P } from "../../h5p/types";
import { TYPE_IMAGE } from "../../image/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("embed normalizer tests", () => {
  test("adds paragraphs around embed", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
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
            type: TYPE_H5P,
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
            type: TYPE_AUDIO,
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
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
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
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_H5P,
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
            type: TYPE_PARAGRAPH,
            children: [{ text: "" }],
          },
          {
            type: TYPE_AUDIO,
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
            type: TYPE_PARAGRAPH,
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
