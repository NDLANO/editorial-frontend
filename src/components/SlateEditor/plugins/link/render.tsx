/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import Link from "./Link";
import { CONTENT_LINK_ELEMENT_TYPE, LINK_ELEMENT_TYPE } from "./types";

export const linkRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === LINK_ELEMENT_TYPE || element.type === CONTENT_LINK_ELEMENT_TYPE) {
      return (
        <Link element={element} attributes={attributes} editor={editor}>
          {children}
        </Link>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
