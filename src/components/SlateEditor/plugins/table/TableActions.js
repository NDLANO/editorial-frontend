/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import { Button } from 'ndla-ui';

const supportedTableOperations = [
  {type: 'row-remove', title: 'Fjern rad'},
  {type: 'row-add', title: 'Legg til rad'},
  {type: 'table-remove', title: 'Fjern tabell'},
  {type: 'column-remove', title: 'Fjern kolonne'},
  {type: 'column-add', title: 'Legg til kolonne'},
];

const TableActions = ({ state, editor }) => {
  const handleOnClick = (e, type) => {
    e.preventDefault();
  }

  return (
    <div className="table-actions">
      {supportedTableOperations.map(operation =>
        <Button key={operation.type} stripped onMouseDown={(e) => handleOnClick(e, operation.type)}>
          <span>
            {operation.title}
          </span>
        </Button>
      )}
    </div>
  );
};

TableActions.propTypes = {
  state: Types.state.isRequired,
};

export default TableActions;
