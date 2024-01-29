/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateAudio from "./SlateAudio";
import { TYPE_AUDIO } from "./types";

export const audioRenderer = (language: string) => (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_AUDIO) {
      return (
        <SlateAudio attributes={attributes} editor={editor} element={element} language={language}>
          {children}
        </SlateAudio>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
