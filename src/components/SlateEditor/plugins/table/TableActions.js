/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Types from 'slate-prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
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
    const position = editor.getPosition();
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
    <div {...classes('', show ? 'show' : 'hidden')}>
      {supportedTableOperations.map(operation => (
        <Button
          key={operation}
          data-cy={operation}
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
