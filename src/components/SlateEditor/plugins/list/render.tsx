/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import styled from '@emotion/styled';
import { OrderedList, UnOrderedList } from '@ndla/ui';
import { TYPE_LIST, TYPE_LIST_ITEM } from './types';

const BulletedList = styled(UnOrderedList)`
  margin: 16px 0;
  padding: 0;
`;

export const listRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_LIST) {
      if (element.listType === 'bulleted-list') {
        return <BulletedList {...attributes}>{children}</BulletedList>;
      } else if (element.listType === 'numbered-list') {
        const { start } = element.data;
        return (
          <OrderedList
            start={start ? parseInt(start) : undefined}
            className={`${start ? `ol-reset-${start}` : ''}`}
            {...attributes}
          >
            {children}
          </OrderedList>
        );
      } else if (element.listType === 'letter-list') {
        const { start } = element.data;
        return (
          <OrderedList
            start={start ? parseInt(start) : undefined}
            data-type="letters"
            className={`ol-list--roman ${start ? `ol-reset-${start}` : ''}`}
            {...attributes}
          >
            {children}
          </OrderedList>
        );
      }
    } else if (element.type === TYPE_LIST_ITEM) {
      return <li {...attributes}>{children}</li>;
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
