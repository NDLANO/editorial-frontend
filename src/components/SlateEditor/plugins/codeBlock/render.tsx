/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import CodeBlock from "./CodeBlock";
import { TYPE_CODEBLOCK } from "./types";

export const codeblockRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_CODEBLOCK) {
      return (
        <CodeBlock editor={editor} element={element} attributes={attributes}>
          {children}
        </CodeBlock>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
