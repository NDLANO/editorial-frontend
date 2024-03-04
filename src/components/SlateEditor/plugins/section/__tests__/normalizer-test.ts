/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import withPlugins from "../../../utils/withPlugins";
import { TYPE_HEADING } from "../../heading/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../types";

const editor = withHistory(withReact(withPlugins(createEditor(), learningResourcePlugins)));

describe("section normalizer tests", () => {
  test("adds paragraph to empty section", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [],
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
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("wraps child text in paragraph", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [{ text: "abc" }],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: "abc" }],
          },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("adds paragraph to the end of the section", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_HEADING,
            level: 1,
            children: [{ text: "heading" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_HEADING,
            level: 1,
            children: [{ text: "heading" }],
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
