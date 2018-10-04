/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Types from 'slate-prop-types';
import Button from 'ndla-button';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import { editTablePlugin } from '../externalPlugins';
import { EditorShape } from '../../../../shapes';

const supportedTableOperations = [
  'row-remove',
  'row-add',
  'table-remove',
  'column-remove',
  'column-add',
];

const classes = new BEMHelper({
  name: 'table-actions',
  prefix: 'c-',
});

const TableActions = ({ value, editor, t }) => {
  const handleOnClick = (e, operation) => {
    e.preventDefault();
    const change = value.change();
    const position = editTablePlugin.utils.getPosition(value);
    switch (operation) {
      case 'row-remove': {
        if (position.getHeight() > 2) {
          editTablePlugin.changes.removeRow(change);
        }
        break;
      }
      case 'row-add':
        editTablePlugin.changes.insertRow(change);
        break;
      case 'column-remove': {
        if (position.getWidth() > 1) {
          editTablePlugin.changes.removeColumn(change);
        }
        break;
      }
      case 'column-add':
        editTablePlugin.changes.insertColumn(change);
        break;
      case 'table-remove':
        editTablePlugin.changes.removeTable(change);
        break;
      default:
    }
    editor.onChange(change);
  };

  const show =
    editTablePlugin.utils.isSelectionInTable(value) && value.isFocused;
  return (
    <div {...classes('', show ? 'show' : 'hidden')}>
      {supportedTableOperations.map(operation => (
        <Button
          key={operation}
          stripped
          onMouseDown={e => handleOnClick(e, operation)}
          {...classes('button')}>
          <span>{t(`form.content.table.${operation}`)}</span>
        </Button>
      ))}
    </div>
  );
};

TableActions.propTypes = {
  value: Types.value.isRequired,
  editor: EditorShape.isRequired,
};

export default injectT(TableActions);
