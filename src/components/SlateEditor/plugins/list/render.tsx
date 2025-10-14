/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { LIST_ELEMENT_TYPE, LIST_ITEM_ELEMENT_TYPE } from "@ndla/editor";
import { OrderedList, UnOrderedList } from "@ndla/primitives";

export const listRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === LIST_ELEMENT_TYPE) {
      if (element.listType === "bulleted-list") {
        return <UnOrderedList {...attributes}>{children}</UnOrderedList>;
      } else if (element.listType === "numbered-list") {
        const { start } = element.data;
        return (
          <OrderedList start={start} {...attributes}>
            {children}
          </OrderedList>
        );
      } else if (element.listType === "letter-list") {
        const { start } = element.data;
        return (
          <OrderedList start={start} variant="letters" {...attributes}>
            {children}
          </OrderedList>
        );
      }
    } else if (element.type === LIST_ITEM_ELEMENT_TYPE) {
      return <li {...attributes}>{children}</li>;
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
