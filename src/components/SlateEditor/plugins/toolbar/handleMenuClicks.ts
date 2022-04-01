/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { insertLink } from '../link/utils';
import toggleBlock from '../../utils/toggleBlock';
import { toggleHeading } from '../heading/utils';
import { LIST_TYPES } from '../list/types';
import { toggleList } from '../list/utils/toggleList';
import { insertMathml } from '../mathml/utils';
import { insertInlineConcept } from '../concept/inline/utils';
import { toggleSpan } from '../span/utils';

export function handleClickBlock(event: KeyboardEvent, editor: Editor, type: string) {
  event.preventDefault();
  if (type === 'quote') {
    toggleBlock(editor, type);
  } else if (type === 'heading-2') {
    toggleHeading(editor, 2);
  } else if (type === 'heading-3') {
    toggleHeading(editor, 3);
  } else if (LIST_TYPES.includes(type)) {
    toggleList(editor, type);
  }
}

export function handleClickInline(event: KeyboardEvent, editor: Editor, type: string) {
  if (editor.selection) {
    event.preventDefault();
    if (type === 'link') {
      insertLink(editor);
    }
    if (type === 'mathml') {
      insertMathml(editor);
    }
    if (type === 'concept') {
      insertInlineConcept(editor);
    }
    if (type === 'span') {
      toggleSpan(editor);
    }
  }
}
