/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { AUDIO_ELEMENT_TYPE } from "./audioTypes";
import SlateAudio from "./SlateAudio";

export const audioRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === AUDIO_ELEMENT_TYPE) {
      return (
        <SlateAudio attributes={attributes} editor={editor} element={element}>
          {children}
        </SlateAudio>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
