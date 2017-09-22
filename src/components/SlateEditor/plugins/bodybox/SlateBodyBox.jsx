/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-ui/icons';
import { NodeShape, EditorShape } from '../../../../shapes';

const classes = new BEMHelper({
  name: 'bodybox',
  prefix: 'c-',
});

const SlateBodyBox = props => {
  const { node, editor } = props;

  const onRemoveClick = () => {
    const next = editor.getState().change().removeNodeByKey(node.key);
    editor.onChange(next);
  };
  return (
    <div {...props.attributes} {...classes()}>
      {props.children}
      <Button stripped onClick={onRemoveClick} {...classes('delete-button')}>
        <Cross />
      </Button>
    </div>
  );
};

SlateBodyBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: NodeShape,
  editor: EditorShape,
};

export default SlateBodyBox;
