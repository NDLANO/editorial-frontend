/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateVideo from "./SlateVideo";
import { TYPE_EMBED_BRIGHTCOVE } from "./types";

export const videoRenderer = (editor: Editor) => {
  const { renderElement: nextRenderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_EMBED_BRIGHTCOVE) {
      return (
        <SlateVideo attributes={attributes} editor={editor} element={element}>
          {children}
        </SlateVideo>
      );
    }
    return nextRenderElement?.({ attributes, children, element });
  };

  return editor;
};
