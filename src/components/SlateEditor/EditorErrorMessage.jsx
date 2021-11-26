/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { EditorDeleteButton } from './common/EditorDeleteButton';
import { AttributesShape } from '../../shapes';

const StyledEditorErrorMessage = styled('div')`
  position: relative;
  border: 1px solid ${colors.support.red};
  color: ${colors.support.red};
  padding: 1rem;
`;

const EditorErrorMessage = ({ msg, attributes, onRemoveClick, children }) => (
  <StyledEditorErrorMessage {...attributes} contentEditable={false}>
    {onRemoveClick && <EditorDeleteButton onClick={onRemoveClick} />}
    <span>{msg}</span>
    {children}
  </StyledEditorErrorMessage>
);

EditorErrorMessage.propTypes = {
  attributes: AttributesShape,
  msg: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func,
};

export default EditorErrorMessage;
