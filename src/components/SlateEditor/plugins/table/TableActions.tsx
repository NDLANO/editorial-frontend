/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Editor, Path, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import {
  insertRow,
  removeRow,
  insertColumn,
  removeColumn,
  removeTable,
  toggleRowHeaders,
  insertTableHead,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE,
} from './utils';
import { isTable, isTableHead } from './helpers';
import getCurrentBlock from '../../utils/getCurrentBlock';

const tableActionButtonStyle = css`
  margin: 5px;
  margin-right: 1rem;
  border-bottom: 2px solid ${colors.brand.greyLighter};
  &:hover,
  &:focus {
    border-bottom: 2px solid ${colors.brand.primary};
  }
`;

const StyledTableActions = styled('div')`
  background: ${colors.white};
  display: ${(p: { show: boolean }) => (p.show ? 'block;' : 'none')};
  box-shadow: 1px 1px 8px 1px ${colors.brand.greyLighter};
  border-radius: 5px;
  transform: translateY(-100%);
  top: -10px;
  padding: 5px;
  position: absolute;
`;

const supportedTableOperations = ['row-add', 'column-add', 'row-remove', 'column-remove'];

interface Props {
  editor: Editor;
}

const TableActions = ({ editor }: Props) => {
  const { t } = useTranslation();
  const tableEntry = getCurrentBlock(editor, TYPE_TABLE);
  if (!tableEntry) {
    return null;
  }

  const [table, tablePath] = tableEntry;
  const captionEntry = getCurrentBlock(editor, TYPE_TABLE_CAPTION);

  if (!isTable(table)) {
    return null;
  }

  const handleOnClick = (e: Event, operation: string) => {
    e.preventDefault();
    const selectedPath = editor.selection?.anchor.path;

    if (selectedPath && Path.isDescendant(selectedPath, tablePath)) {
      switch (operation) {
        case 'row-remove': {
          removeRow(editor, selectedPath);
          break;
        }
        case 'row-add':
          insertRow(editor, table, selectedPath);
          break;
        case 'head-add':
          insertTableHead(editor);
          break;
        case 'column-remove': {
          removeColumn(editor, table, selectedPath);
          break;
        }
        case 'column-add':
          insertColumn(editor, table, selectedPath);
          break;
        case 'table-remove':
          removeTable(editor, tablePath);
          break;
        case 'toggle-row-headers':
          toggleRowHeaders(editor, tablePath);
          break;
        default:
      }
    }
  };

  const tableHead = table.children[1];
  const hasTableHead = isTableHead(tableHead);
  const selectedPath = editor.selection?.anchor.path;

  const showAddHeader =
    selectedPath && !hasTableHead && Path.isCommon([...tablePath, 1], selectedPath);
  const show =
    Range.isRange(editor.selection) &&
    Range.includes(editor.selection, tablePath) &&
    ReactEditor.isFocused(editor);
  return (
    <StyledTableActions show={show} contentEditable={false}>
      {!captionEntry &&
        supportedTableOperations.map(operation => (
          <Button
            key={operation}
            data-cy={operation}
            stripped
            onMouseDown={(e: Event) => handleOnClick(e, operation)}
            css={tableActionButtonStyle}>
            <span>{t(`form.content.table.${operation}`)}</span>
          </Button>
        ))}
      <Button
        key={'table-remove'}
        data-cy={'table-remove'}
        stripped
        onMouseDown={(e: Event) => handleOnClick(e, 'table-remove')}
        css={tableActionButtonStyle}>
        <span>{t(`form.content.table.${'table-remove'}`)}</span>
      </Button>
      {!captionEntry && (
        <>
          <Button
            key={'toggle-row-headers'}
            data-cy={'toggle-row-headers'}
            stripped
            onMouseDown={(e: Event) => handleOnClick(e, 'toggle-row-headers')}
            css={tableActionButtonStyle}>
            <span>
              {t(
                `form.content.table.${
                  isTable(table) && table.rowHeaders ? 'disableRowHeaders' : 'enableRowHeaders'
                }`,
              )}
            </span>
          </Button>
          {showAddHeader && (
            <Button
              key={'head-add'}
              data-cy={'head-add'}
              stripped
              onMouseDown={(e: Event) => handleOnClick(e, 'head-add')}
              css={tableActionButtonStyle}>
              <span>{t(`form.content.table.addHead`)}</span>
            </Button>
          )}
        </>
      )}
    </StyledTableActions>
  );
};

export default TableActions;
