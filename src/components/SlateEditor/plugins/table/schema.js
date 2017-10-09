/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';
import SlateTable from './SlateTable';

/* eslint-disable react/prop-types */
const tableSchema = {
  nodes: {
    table: SlateTable,
    'table-row': props => <tr {...props.attributes}>{props.children}</tr>,
    'table-cell': props => <td {...props.attributes}>{props.children}</td>,
    'table-body': props => {
      console.log("POOOOORPS, ", props);
      return (
        <tbody className="Test">
        {props.children}
        </tbody>
      );
    },
  },
};

export default tableSchema;
