/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Range, Path } from 'slate';

export const isDefinitionListItem = (editor: Editor, path: Path) =>
  Range.isRange(editor.selection) && Range.includes(editor.selection, path.concat(0));
