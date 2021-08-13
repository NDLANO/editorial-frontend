/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { Editor, Path, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import { insertRow, removeRow, insertColumn, removeColumn, removeTable } from './utils';
import { TableElement } from '.';

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
  element: TableElement;
}

const TableActions = ({ editor, t, element }: Props & tType) => {
  const handleOnClick = (e: Event, operation: string) => {
    e.preventDefault();
    const selectedPath = editor.selection?.anchor.path;
    const tablePath = ReactEditor.findPath(editor, element);
    if (selectedPath && Path.isDescendant(selectedPath, tablePath)) {
      switch (operation) {
        case 'row-remove': {
          removeRow(editor, selectedPath);
          break;
        }
        case 'row-add':
          insertRow(editor, element, selectedPath);
          break;
        case 'column-remove': {
          removeColumn(editor, element, selectedPath);
          break;
        }
        case 'column-add':
          insertColumn(editor, element, selectedPath);
          break;
        case 'table-remove':
          removeTable(editor, tablePath);
          break;
        default:
      }
    }
  };

  const show =
    Range.isRange(editor.selection) &&
    Range.includes(editor.selection, ReactEditor.findPath(editor, element)) &&
    ReactEditor.isFocused(editor);
  return (
    <StyledTableActions show={show} contentEditable={false}>
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
