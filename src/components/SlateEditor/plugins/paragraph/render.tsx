/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_PARAGRAPH } from './types';
import Paragraph from './Paragraph';
import { BlockPickerOptions } from '../blockPicker/options';

export const paragraphRenderer =
  (language?: string, blockpickerOptions?: BlockPickerOptions) => (editor: Editor) => {
    const { renderElement } = editor;
    editor.renderElement = ({ attributes, children, element }) => {
      if (element.type === TYPE_PARAGRAPH) {
        return (
          <Paragraph
            attributes={attributes}
            element={element}
            editor={editor}
            language={language}
            blockpickerOptions={blockpickerOptions}
          >
            {children}
          </Paragraph>
        );
      } else return renderElement?.({ attributes, children, element });
    };
    return editor;
  };
