/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode } from 'react';
import { Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import TableActions from './TableActions';

interface Props {
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  element: Element;
  children: ReactNode;
}

const SlateTable = (props: Props) => {
  const { editor, attributes, element, children } = props;
  return (
    <div {...attributes}>
      <TableActions editor={editor} element={element} />
      <table>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default SlateTable;
