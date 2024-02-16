/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";

export const noopRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === "noop") {
      // We just have to render something. If not, this can create a paragraph within a paragraph.
      return <div {...attributes}>{children}</div>;
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
