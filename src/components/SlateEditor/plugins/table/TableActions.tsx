/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { Editor, Element, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';

const tableActionButtonStyle = css`
  margin-right: 1rem;
  border-bottom: 2px solid transparent;
  &:hover,
  &:focus {
    border-bottom: 2px solid ${colors.brand.primary};
  }
`;

const StyledTableActions = styled('div')`
  display: ${(p: { show: boolean }) => (p.show ? 'block;' : 'none')};
  position: absolute;
`;

const supportedTableOperations = [
  'row-add',
  'column-add',
  'row-remove',
  'column-remove',
  'table-remove',
];

interface Props {
  editor: Editor;
  element: Element;
}

const TableActions = ({ editor, t, element }: Props & tType) => {
  const handleOnClick = (e: Event, operation: string) => {
    e.preventDefault();
    const position = editor.getTablePosition();
    switch (operation) {
      case 'row-remove': {
        if (position.getHeight() > 2) {
          editor.removeRow();
        }
        break;
      }
      case 'row-add':
        editor.insertRow();
        break;
      case 'column-remove': {
        if (position.getWidth() > 1) {
          editor.removeColumn();
        }
        break;
      }
      case 'column-add':
        editor.insertColumn();
        break;
      case 'table-remove':
        editor.removeTable();
        break;
      default:
    }
  };

  const show =
    (editor.selection &&
      Range.includes(editor.selection, ReactEditor.findPath(editor, element)) &&
      ReactEditor.isFocused(editor)) ||
    false;
  return (
    <StyledTableActions show={show}>
      {supportedTableOperations.map(operation => (
        <Button
          key={operation}
          data-cy={operation}
          stripped
          onMouseDown={(e: Event) => handleOnClick(e, operation)}
          css={tableActionButtonStyle}>
          <span>{t(`form.content.table.${operation}`)}</span>
        </Button>
      ))}
    </StyledTableActions>
  );
};

export default injectT(TableActions);
