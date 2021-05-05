/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from 'new-slate';

const hasNodeOfType = (editor: Editor, props: Partial<Element>) => {
  const [match] = Editor.nodes(editor, {
    match: node => {
      return Element.isElement(node) && Element.matches(node, props);
    },
  });
  return !!match;
};

export default hasNodeOfType;
