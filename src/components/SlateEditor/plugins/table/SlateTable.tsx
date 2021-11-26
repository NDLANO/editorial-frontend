/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode } from 'react';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { TableElement } from './interfaces';
import TableActions from './TableActions';

interface Props {
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  element: TableElement;
  children: ReactNode;
}

const SlateTable = (props: Props) => {
  const { editor, attributes, element, children } = props;
  return (
    <div className="c-table__wrapper c-table__content">
      <TableActions editor={editor} element={element} />
      <table {...attributes}>{children}</table>
    </div>
  );
};

export default SlateTable;
