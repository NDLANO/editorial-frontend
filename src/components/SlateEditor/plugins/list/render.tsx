/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { OrderedList, UnOrderedList } from "@ndla/primitives";
import { TYPE_LIST, TYPE_LIST_ITEM } from "./types";

export const listRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_LIST) {
      if (element.listType === "bulleted-list") {
        return <UnOrderedList {...attributes}>{children}</UnOrderedList>;
      } else if (element.listType === "numbered-list") {
        const { start } = element.data;
        return (
          <OrderedList start={start ? parseInt(start) : undefined} {...attributes}>
            {children}
          </OrderedList>
        );
      } else if (element.listType === "letter-list") {
        const { start } = element.data;
        return (
          <OrderedList start={start ? parseInt(start) : undefined} variant="letters" {...attributes}>
            {children}
          </OrderedList>
        );
      }
    } else if (element.type === TYPE_LIST_ITEM) {
      return <li {...attributes}>{children}</li>;
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
