/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { EditorDeleteButton } from './common/EditorDeleteButton';

const StyledEditorErrorMessage = styled.div`
  position: relative;
  border: 1px solid ${colors.support.red};
  color: ${colors.support.red};
  padding: 1rem;
`;

interface Props {
  msg: string;
  onRemoveClick?: MouseEventHandler;
  attributes?: HTMLAttributes<HTMLDivElement>;
  children?: ReactNode;
}

const EditorErrorMessage = ({ msg, attributes, onRemoveClick, children }: Props) => (
  <StyledEditorErrorMessage {...attributes} contentEditable={false}>
    {onRemoveClick && <EditorDeleteButton onClick={onRemoveClick} />}
    <span>{msg}</span>
    {children}
  </StyledEditorErrorMessage>
);

export default EditorErrorMessage;
