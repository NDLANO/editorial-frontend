/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { isSlateEmbedElement } from './utils';
import SlateFigure from './SlateFigure';

export const embedRenderer = (language: string, allowDecorative?: boolean) => (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (isSlateEmbedElement(element)) {
      return (
        <SlateFigure
          attributes={attributes}
          editor={editor}
          element={element}
          language={language}
          allowDecorative={allowDecorative}
        >
          {children}
        </SlateFigure>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
