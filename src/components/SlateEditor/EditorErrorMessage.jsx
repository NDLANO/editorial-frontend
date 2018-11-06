/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { colors } from 'ndla-core';
import { EditorDeleteButton } from './common/EditorDeleteButton';

const StyledEditorErrorMessage = styled('div')`
  position: relative;
  border: 1px solid ${colors.support.red};
  color: ${colors.support.red};
  padding: 1rem;
`;

const EditorErrorMessage = ({ msg, attributes, onRemoveClick, children }) => (
  <StyledEditorErrorMessage {...attributes}>
    {onRemoveClick && <EditorDeleteButton onClick={onRemoveClick} />}
    <span>{msg}</span>
    {children}
  </StyledEditorErrorMessage>
);

EditorErrorMessage.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  msg: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func,
};

export default EditorErrorMessage;
