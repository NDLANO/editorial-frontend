/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
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
  editColgroups,
} from './utils';
import { TableElement } from './interfaces';
import { isTable, isTableHead } from './helpers';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { TYPE_TABLE_CAPTION } from './types';
import { useSession } from '../../../../containers/Session/SessionProvider';
import { DRAFT_ADMIN_SCOPE } from '../../../../constants';

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
  box-shadow: 1px 1px 8px 1px ${colors.brand.greyLighter};
  border-radius: 5px;
  bottom: -50px;
  padding: 5px;
  position: absolute;
`;

const StyledWrapper = styled('div')`
  display: ${(p: { show: boolean }) => (p.show ? 'block;' : 'none')};
  position: relative;
  z-index: 1;
`;

const supportedTableOperations = ['row-add', 'column-add', 'row-remove', 'column-remove'];

interface Props {
  editor: Editor;
  element: TableElement;
}

const TableActions = ({ editor, element }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const tablePath = ReactEditor.findPath(editor, element);
  const [table] = Editor.node(editor, tablePath);
  const captionEntry = getCurrentBlock(editor, TYPE_TABLE_CAPTION);

  if (!isTable(table)) {
    return null;
  }

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>, operation: string) => {
    e.preventDefault();
    const selectedPath = editor.selection?.anchor.path;

    if (selectedPath && Path.isDescendant(selectedPath, tablePath)) {
      switch (operation) {
        case 'row-remove': {
          removeRow(editor, selectedPath);
          break;
        }
        case 'row-add':
          insertRow(editor, element, selectedPath);
          break;
        case 'head-add':
          insertTableHead(editor);
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
        case 'toggle-row-headers':
          toggleRowHeaders(editor, tablePath);
          break;
        case 'edit-colgroups':
          editColgroups(editor, tablePath);
          break;
        default:
      }
    }
  };

  const tableHead = table.children[1];
  const hasTableHead = isTableHead(tableHead);
  const selectedPath = editor.selection?.anchor.path;

  const showAddHeader = selectedPath && !hasTableHead;
  const showEditColgroups = !captionEntry && userPermissions?.includes(DRAFT_ADMIN_SCOPE);
  const show =
    Range.isRange(editor.selection) &&
    Range.includes(editor.selection, ReactEditor.findPath(editor, element)) &&
    ReactEditor.isFocused(editor);
  return (
    <StyledWrapper contentEditable={false} show={show}>
      <StyledTableActions>
        {!captionEntry &&
          supportedTableOperations.map(operation => (
            <Button
              key={operation}
              data-cy={operation}
              stripped
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, operation)}
              css={tableActionButtonStyle}>
              <span>{t(`form.content.table.${operation}`)}</span>
            </Button>
          ))}
        {showEditColgroups && (
          <Button
            key={'edit-colgroups'}
            data-cy={'edit-colgroups'}
            stripped
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'edit-colgroups')}
            css={tableActionButtonStyle}>
            <span>{t(`form.content.table.edit-colgroups`)}</span>
          </Button>
        )}
        <Button
          key={'table-remove'}
          data-cy={'table-remove'}
          stripped
          onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'table-remove')}
          css={tableActionButtonStyle}>
          <span>{t(`form.content.table.${'table-remove'}`)}</span>
        </Button>
        {!captionEntry && (
          <>
            <Button
              key={'toggle-row-headers'}
              data-cy={'toggle-row-headers'}
              stripped
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) =>
                handleOnClick(e, 'toggle-row-headers')
              }
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
                onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'head-add')}
                css={tableActionButtonStyle}>
                <span>{t(`form.content.table.addHead`)}</span>
              </Button>
            )}
          </>
        )}
      </StyledTableActions>
    </StyledWrapper>
  );
};

export default TableActions;
