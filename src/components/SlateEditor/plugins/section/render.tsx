/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import Section from './Section';

export const sectionRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'section') {
      return (
        <Section attributes={attributes} element={element} editor={editor}>
          {children}
        </Section>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
