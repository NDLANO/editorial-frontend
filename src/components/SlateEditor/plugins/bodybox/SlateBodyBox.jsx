/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';
import { EditorShape } from '../../../../shapes';

const StyledBodyBox = styled('div')`
  position: relative;
`;

const SlateBodyBox = props => {
  const { node, editor, attributes, children } = props;

  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
  };

  const onMoveContent = () => {
    editor.unwrapBlockByKey(node.key, node.type);
  };

  return (
    <StyledBodyBox draggable className="c-bodybox" {...attributes}>
      {children}
      <DeleteButton data-cy="remove-bodybox" stripped onMouseDown={onRemoveClick} />
      <MoveContentButton onMouseDown={onMoveContent} />
    </StyledBodyBox>
  );
};

SlateBodyBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: PropTypes.any,
  editor: EditorShape,
};

export default SlateBodyBox;
