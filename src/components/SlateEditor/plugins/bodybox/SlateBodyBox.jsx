/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Types from 'slate-prop-types';
import { EditorShape } from '../../../../shapes';
import DeleteButton from '../../../DeleteButton';

const StyledBodyBox = styled('div')`
  position: relative;
`;

const SlateBodyBox = props => {
  const { node, editor } = props;

  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
  };
  return (
    <StyledBodyBox {...props.attributes}>
      {props.children}
      <DeleteButton stripped onClick={onRemoveClick} />
    </StyledBodyBox>
  );
};

SlateBodyBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default SlateBodyBox;
