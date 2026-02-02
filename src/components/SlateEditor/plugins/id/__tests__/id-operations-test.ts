/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate, PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant, Element, NodeEntry, Node, Transforms } from "slate";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("idPlugin", () => {
  test("should assign unique ids to nodes", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });

    const nodes: NodeEntry<Element>[] = Array.from(
      editor.nodes({ match: (node) => Node.isElement(node) && !!node.id, at: [] }),
    );

    expect(nodes.length).toBe(3); // 2 paragraphs + 1 section
    const idsSet = new Set<string>(nodes.filter(([n]) => n.id).map(([n]) => n.id!));
    expect(idsSet.size).toBe(3); // all ids should be unique
  });
  test("splitting a node in the middle should ensure that the new nodes have unique ids", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "Denne splittes" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];

    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 6 } });

    const nodes: NodeEntry<Element>[] = Array.from(
      editor.nodes({ match: (node) => Node.isElement(node) && node.type === "paragraph", at: [] }),
    );

    expect(nodes.length).toBe(3);

    const idsSet = new Set<string>(nodes.filter(([n]) => n.id).map(([n]) => n.id!));
    expect(idsSet.size).toBe(3); // all ids should be unique
  });
  test("should assign unique ids when pasting nodes that have already gotten unique ids", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "Paragraf 1" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "Paragraf 2" }],
          },
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [{ text: "" }],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });

    const paragraphNodes = Array.from(
      editor.nodes({ at: [], match: (n) => Node.isElement(n) && n.type === "paragraph" }),
    );

    const [id1, id2] = paragraphNodes.map(([node]) => node.id);

    Transforms.insertFragment(
      editor,
      [
        { type: PARAGRAPH_ELEMENT_TYPE, id: id1, children: [{ text: "Paragraf 1" }] },
        { type: PARAGRAPH_ELEMENT_TYPE, id: id2, children: [{ text: "Paragraf 2" }] },
      ],
      { at: [0, 2] },
    );

    const allParagraphNodes = Array.from(
      editor.nodes({ at: [], match: (n) => Node.isElement(n) && n.type === "paragraph" }),
    );

    const paragraphIds = new Set(allParagraphNodes.filter(([node]) => node.id).map(([node]) => node.id!));

    expect(allParagraphNodes.length).toBe(4);
    expect(paragraphIds.size).toBe(4);
  });
});
