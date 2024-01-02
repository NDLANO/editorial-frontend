/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import Link from "./Link";

export const linkRenderer = (language: string) => (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === "link" || element.type === "content-link") {
      return (
        <Link element={element} attributes={attributes} editor={editor} language={language}>
          {children}
        </Link>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
