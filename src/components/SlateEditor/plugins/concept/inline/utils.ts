/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range, Location } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { CONCEPT_INLINE_ELEMENT_TYPE } from "./types";
import { ConceptType } from "../../../../../containers/ConceptPage/conceptInterfaces";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { isConceptInlineElement } from "./queries";

export const insertInlineConcept = (editor: Editor, conceptType: ConceptType) => {
  if (hasNodeOfType(editor, CONCEPT_INLINE_ELEMENT_TYPE)) {
    Transforms.unwrapNodes(editor, {
      match: isConceptInlineElement,
      voids: true,
    });
    return;
  }
  if (editor.selection && Location.isRange(editor.selection) && !Range.isCollapsed(editor.selection)) {
    const unhangedRange = Editor.unhangRange(editor, editor.selection);
    Transforms.select(editor, unhangedRange);

    const text = Editor.string(editor, unhangedRange);
    const leftSpaces = text.length - text.trimStart().length;
    const rightSpaces = text.length - text.trimEnd().length;

    if (leftSpaces) {
      Transforms.move(editor, {
        distance: leftSpaces,
        unit: "offset",
        edge: "start",
      });
    }

    if (rightSpaces) {
      Transforms.move(editor, {
        distance: rightSpaces,
        unit: "offset",
        edge: "end",
        reverse: true,
      });
    }

    Transforms.wrapNodes(
      editor,
      slatejsx("element", {
        type: CONCEPT_INLINE_ELEMENT_TYPE,
        isFirstEdit: true,
        conceptType: conceptType,
        data: {},
      }),
      {
        at: Editor.unhangRange(editor, editor.selection),
        split: true,
      },
    );
  }
};
