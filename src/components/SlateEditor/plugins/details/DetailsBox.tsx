/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Editor, Node } from 'slate';
import Details from './Details';

interface Props {
  attributes: {
    'data-key': string;
    'data-slate-object': string;
  };
  children: ReactElement[];
  editor: Editor;
  node: Node;
}

const DetailsBox = ({ t, attributes, children, editor, node }: Props & tType) => {
  return (
    <div draggable {...attributes}>
      <Details editor={editor} node={node}>
        {children}
      </Details>
    </div>
  );
};

export default injectT(DetailsBox);
