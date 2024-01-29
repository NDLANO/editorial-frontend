/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import Details from "./Details";
import Summary from "./Summary";
import { TYPE_DETAILS, TYPE_SUMMARY } from "./types";

export const detailsRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_SUMMARY) {
      return (
        <Summary attributes={attributes} element={element}>
          {children}
        </Summary>
      );
    } else if (element.type === TYPE_DETAILS) {
      return (
        <Details attributes={attributes} editor={editor} element={element}>
          {children}
        </Details>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
