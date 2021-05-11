/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from 'new-slate';
import { isMarkActive } from '../plugins/mark';

const hasNodeOfType = (editor: Editor, type: string, kind: string) => {
  if (kind === 'mark') {
    return isMarkActive(editor, type);
  } else if (kind === 'block') {
    const [match] = Editor.nodes(editor, {
      match: node => Element.isElement(node) && node.type === type,
    });
    return !!match;
  }
};

export default hasNodeOfType;
