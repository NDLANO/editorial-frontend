/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { TYPE_CONCEPT_LIST } from './types';
import ConceptList from './ConceptList';

export const conceptListRenderer = (language: string) => (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_CONCEPT_LIST) {
      return (
        <ConceptList attributes={attributes} element={element} language={language} editor={editor}>
          {children}
        </ConceptList>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};