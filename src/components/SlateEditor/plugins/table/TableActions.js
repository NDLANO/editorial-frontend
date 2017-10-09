/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Types from 'slate-prop-types';
import { Button } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import { editTablePlugin } from '../externalPlugins';
import { EditorShape } from '../../../../shapes';

const supportedTableOperations = [
  {
    type: 'row-remove',
    title: 'Fjern rad',
    action: change => editTablePlugin.changes.removeRow(change),
  },
  {
    type: 'row-add',
    title: 'Legg til rad',
    action: change => editTablePlugin.changes.insertRow(change),
  },
  {
    type: 'table-remove',
    title: 'Fjern tabell',
    action: change => editTablePlugin.changes.removeTable(change),
  },
  {
    type: 'column-remove',
    title: 'Fjern kolonne',
    action: change => editTablePlugin.changes.removeColumn(change),
  },
  {
    type: 'column-add',
    title: 'Legg til kolonne',
    action: change => editTablePlugin.changes.insertColumn(change),
  },
];

const classes = new BEMHelper({
  name: 'table-actions',
  prefix: 'c-',
});

const TableActions = ({ state, editor }) => {
  const handleOnClick = (e, operation) => {
    const change = state.change();
    editor.onChange(operation.action(change));
  };
  const show = editTablePlugin.utils.isSelectionInTable(state);
  return (
    <div {...classes('', show ? 'show' : 'hidden')}>
      {supportedTableOperations.map(operation => (
        <Button
          key={operation.type}
          stripped
          onMouseDown={e => handleOnClick(e, operation)}
          {...classes('button')}>
          <span>{operation.title}</span>
        </Button>
      ))}
    </div>
  );
};

TableActions.propTypes = {
  state: Types.state.isRequired,
  editor: EditorShape.isRequired,
};

export default TableActions;
