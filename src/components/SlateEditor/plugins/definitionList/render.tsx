/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { DefinitionList } from "@ndla/primitives";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from "./types";

export const definitionListRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_DEFINITION_LIST) {
      return <DefinitionList {...attributes}>{children}</DefinitionList>;
    } else if (element.type === TYPE_DEFINITION_DESCRIPTION) {
      return <dd {...attributes}>{children}</dd>;
    } else if (element.type === TYPE_DEFINITION_TERM) {
      return <dt {...attributes}>{children}</dt>;
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
