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
import { colors, fonts } from '@ndla/core';
import { AlignCenter, AlignLeft, AlignRight } from '@ndla/icons/lib/editor';
import Button from '@ndla/button';
import { Minus, Pencil, Plus } from '@ndla/icons/lib/action';
import IconButton from '../../../../components/IconButton';
import {
  insertRow,
  removeRow,
  insertColumn,
  removeColumn,
  toggleRowHeaders,
  insertTableHead,
  editColgroups,
  alignColumn,
} from './utils';
import { TableElement } from './interfaces';
import { isTable, isTableHead } from './helpers';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { TYPE_TABLE_CAPTION } from './types';
import { useSession } from '../../../../containers/Session/SessionProvider';
import { DRAFT_HTML_SCOPE } from '../../../../constants';

const tableActionButtonStyle = css``;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  margin: 5px;
  gap: 5px;
`;

const StyledIconButton = styled(IconButton)`
  display: flex;
  align-items: center;
  margin: 5px;
`;

const StyledTableActions = styled('div')`
  background: ${colors.white};
  box-shadow: 1px 1px 8px 1px ${colors.brand.greyLighter};
  border-radius: 5px;
  bottom: -50px;
  padding: 10px;
  position: absolute;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 10px;
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const rightAlign = styled.div`
  margin-left: auto;
`;

const StyledWrapper = styled('div')`
  display: ${(p: { show: boolean }) => (p.show ? 'block;' : 'none')};
  position: relative;
  z-index: 1;
  user-select: none;
`;

const StyledRowTitle = styled.strong`
  font-family: ${fonts.sans};
`;

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

  if (!isTable(table) || captionEntry) {
    return null;
  }

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>, operation: string) => {
    e.preventDefault();
    e.stopPropagation();
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
        case 'column-remove':
          removeColumn(editor, element, selectedPath);
          break;
        case 'column-add':
          insertColumn(editor, element, selectedPath);
          break;
        case 'column-left':
          alignColumn(editor, tablePath, 'left');
          break;
        case 'column-center':
          alignColumn(editor, tablePath, 'center');
          break;
        case 'column-right':
          alignColumn(editor, tablePath, 'right');
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
  const showEditColgroups = userPermissions?.includes(DRAFT_HTML_SCOPE);
  const show =
    Range.isRange(editor.selection) &&
    Range.includes(editor.selection, ReactEditor.findPath(editor, element)) &&
    ReactEditor.isFocused(editor);

  return (
    <StyledWrapper contentEditable={false} show={show}>
      <StyledTableActions>
        <ActionGroup>
          {showEditColgroups && (
            <StyledButton
              data-cy={'edit-colgroups'}
              stripped
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) =>
                handleOnClick(e, 'edit-colgroups')
              }>
              {t('form.content.table.colgroups')}
              <Pencil />
            </StyledButton>
          )}
        </ActionGroup>
        <ActionGroup></ActionGroup>
        <ActionGroup>
          <StyledRowTitle>rad:</StyledRowTitle>
          <StyledIconButton
            type="button"
            data-cy={'row-add'}
            title={t('form.content.table.row-add')}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'row-add')}>
            <Plus />
          </StyledIconButton>
          <StyledIconButton
            type="button"
            data-cy={'row-remove'}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'row-remove')}
            title={t('form.content.table.row-remove')}>
            <Minus />
          </StyledIconButton>
        </ActionGroup>
        <ActionGroup css={rightAlign}>
          <StyledButton
            data-cy={'toggle-row-headers'}
            stripped
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) =>
              handleOnClick(e, 'toggle-row-headers')
            }
            title={t(
              `form.content.table.${
                isTable(table) && table.rowHeaders ? 'disable-header' : 'enable-header'
              }`,
            )}>
            {t(
              `form.content.table.${
                isTable(table) && table.rowHeaders ? 'disable-header' : 'enable-header'
              }`,
            )}
          </StyledButton>
        </ActionGroup>
        <ActionGroup>
          <StyledRowTitle>kol:</StyledRowTitle>
          <StyledIconButton
            type="button"
            data-cy={'column-add'}
            title={t(`form.content.table.column-add`)}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'column-add')}>
            <Plus />
          </StyledIconButton>
          <StyledIconButton
            type="button"
            data-cy={'column-remove'}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'column-remove')}
            title={t(`form.content.table.column-remove`)}>
            <Minus />
          </StyledIconButton>
          <StyledIconButton
            type="button"
            data-cy={'column-left'}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'column-left')}
            title={t(`form.content.table.column-left`)}>
            <AlignLeft />
          </StyledIconButton>
          <StyledIconButton
            type="button"
            data-cy={'column-center'}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'column-center')}
            title={t(`form.content.table.column-center`)}>
            <AlignCenter />
          </StyledIconButton>
          <StyledIconButton
            type="button"
            data-cy={'column-right'}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'column-right')}
            title={t(`form.content.table.column-right`)}>
            <AlignRight />
          </StyledIconButton>
        </ActionGroup>
        <ActionGroup>
          {showAddHeader && (
            <StyledButton
              key={'head-add'}
              data-cy={'head-add'}
              stripped
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, 'head-add')}
              css={tableActionButtonStyle}>
              <span>{t(`form.content.table.addHead`)}</span>
            </StyledButton>
          )}
        </ActionGroup>
      </StyledTableActions>
    </StyledWrapper>
  );
};

export default TableActions;
