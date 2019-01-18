/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Types from 'slate-prop-types';
import styled, { css } from 'react-emotion';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { EditorShape } from '../../../../shapes';

const tableActionButtonStyle = css`
  margin-right: 1rem;

  &:hover,
  &:focus {
    border-bottom: 2px solid ${colors.brand.primary};
  }
`;

const StyledTableActions = styled('div')`
  margin-bottom: -1px;
  margin-left: 8.66667px;
  ${p => (p.show ? 'display: block;' : 'display: none;')};
`;

const supportedTableOperations = [
  'row-remove',
  'row-add',
  'table-remove',
  'column-remove',
  'column-add',
];

const TableActions = ({ value, editor, t }) => {
  const handleOnClick = (e, operation) => {
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

  const show = editor.isSelectionInTable() && value.selection.isFocused;
  return (
    <StyledTableActions show={show}>
      {supportedTableOperations.map(operation => (
        <Button
          key={operation}
          data-cy={operation}
          stripped
          onMouseDown={e => handleOnClick(e, operation)}
          css={tableActionButtonStyle}>
          <span>{t(`form.content.table.${operation}`)}</span>
        </Button>
      ))}
    </StyledTableActions>
  );
};

TableActions.propTypes = {
  value: Types.value.isRequired,
  editor: EditorShape.isRequired,
};

export default injectT(TableActions);
