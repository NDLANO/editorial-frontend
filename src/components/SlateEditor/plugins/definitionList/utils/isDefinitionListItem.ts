/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { DefinitionTermElement, DefinitionDescriptionElement } from '..';

export const isListItemSelected = (
  editor: Editor,
  node: DefinitionTermElement | DefinitionDescriptionElement,
) =>
  Range.isRange(editor.selection) &&
  Range.includes(editor.selection, ReactEditor.findPath(editor, node).concat(0));
