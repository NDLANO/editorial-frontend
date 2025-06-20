/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { DefinitionList } from "@ndla/primitives";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "./definitionListTypes";

export const definitionListRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === DEFINITION_LIST_ELEMENT_TYPE) {
      return <DefinitionList {...attributes}>{children}</DefinitionList>;
    } else if (element.type === DEFINITION_DESCRIPTION_ELEMENT_TYPE) {
      return <dd {...attributes}>{children}</dd>;
    } else if (element.type === DEFINITION_TERM_ELEMENT_TYPE) {
      return <dt {...attributes}>{children}</dt>;
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
