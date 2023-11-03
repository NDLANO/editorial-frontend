/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { DefinitionDescription, DefinitionTerm } from '@ndla/ui';
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from './types';

export const definitionListRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_DEFINITION_LIST) {
      return <dl {...attributes}>{children}</dl>;
    } else if (element.type === TYPE_DEFINITION_DESCRIPTION) {
      return <DefinitionDescription {...attributes}>{children}</DefinitionDescription>;
    } else if (element.type === TYPE_DEFINITION_TERM) {
      return <DefinitionTerm {...attributes}>{children}</DefinitionTerm>;
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
