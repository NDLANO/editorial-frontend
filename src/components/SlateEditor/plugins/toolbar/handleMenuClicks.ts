/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SyntheticEvent } from "react";
import { Editor } from "slate";
import toggleBlock from "../../utils/toggleBlock";
import { insertInlineConcept } from "../concept/inline/utils";
import { toggleDefinitionList } from "../definitionList/utils/toggleDefinitionList";
import { toggleHeading } from "../heading/utils";
import { insertLink } from "../link/utils";
import { LIST_TYPES } from "../list/types";
import { toggleList } from "../list/utils/toggleList";
import { insertMathml } from "../mathml/utils";
import { toggleSpan } from "../span/utils";
import { toggleCellAlign } from "../table/slateActions";

export function handleClickBlock(event: SyntheticEvent, editor: Editor, type: string) {
  event.preventDefault();
  if (type === "quote") {
    toggleBlock(editor, type);
  } else if (type === "heading-2") {
    toggleHeading(editor, 2);
  } else if (type === "heading-3") {
    toggleHeading(editor, 3);
  } else if (type === "heading-4") {
    toggleHeading(editor, 4);
  } else if (LIST_TYPES.includes(type)) {
    toggleList(editor, type);
  } else if (type === "definition-list") {
    toggleDefinitionList(editor);
  }
}

export function handleClickInline(event: SyntheticEvent, editor: Editor, type: string) {
  if (editor.selection) {
    event.preventDefault();
    if (type === "link") {
      insertLink(editor);
    }
    if (type === "mathml") {
      insertMathml(editor);
    }
    if (type === "concept") {
      insertInlineConcept(editor);
    }
    if (type === "span") {
      toggleSpan(editor);
    }
  }
}

export const handleClickTable = (event: SyntheticEvent, editor: Editor, type: string) => {
  event.preventDefault();

  if (["left", "center", "right"].includes(type)) {
    toggleCellAlign(editor, type);
  }
};
