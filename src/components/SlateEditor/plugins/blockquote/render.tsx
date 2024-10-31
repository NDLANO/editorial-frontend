/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { SlateBlockQuote } from "./SlateBlockQuote";
import { TYPE_QUOTE } from "./types";

export const blockQuoteRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_QUOTE) {
      return (
        <SlateBlockQuote attributes={attributes} element={element} editor={editor}>
          {children}
        </SlateBlockQuote>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
