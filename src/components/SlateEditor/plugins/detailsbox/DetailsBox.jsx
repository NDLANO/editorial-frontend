/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import { EditorShape } from '../../../../shapes';

const DetailsBox = props => {
  const { node, editor } = props;

  const onRemoveClick = () => {
    const next = editor.value.change().removeNodeByKey(node.key);
    editor.onChange(next);
  };

  return (
    <details {...props.attributes} open>
      {props.children}
      <Button
        stripped
        onClick={onRemoveClick}
        className="c-details__delete-button">
        <Cross />
      </Button>
    </details>
  );
};
DetailsBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default DetailsBox;
