/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { Descendant } from "slate";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TableElement } from "../interfaces";
import { TABLE_ELEMENT_TYPE } from "../types";

export const tableEditor = createSlate({ plugins: learningResourcePlugins });

export const defaultTable = ({
  value,
  props = {},
}: {
  value: Descendant[];
  props?: Partial<TableElement>;
}): Descendant[] => {
  return [
    {
      type: "section",
      id: anySlateElementId,
      children: [
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "Some text" }], id: anySlateElementId },
        {
          type: TABLE_ELEMENT_TYPE,
          id: anySlateElementId,
          children: value,
          rowHeaders: false,
          colgroups: "",
          ...props,
        },
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "Some text" }], id: anySlateElementId },
      ],
    },
  ];
};
