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
import TableActions from './TableActions';
import { EditorShape } from '../../../../shapes';

const SlateTable = props => {
  const { state, editor, attributes } = props;
  return (
    <div {...attributes}>
      <TableActions state={state} editor={editor} />
      <table>
        <tbody>{props.children}</tbody>
      </table>
    </div>
  );
};

SlateTable.propTypes = {
  state: Types.state.isRequired,
  editor: EditorShape.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default SlateTable;
