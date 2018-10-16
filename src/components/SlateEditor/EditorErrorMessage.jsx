import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import { Cross } from 'ndla-icons/action';
import Button from 'ndla-button';
import darken from 'polished/lib/color/darken';
import { colors } from 'ndla-core';

const StyledEditorErrorMessage = styled('div')`
  position: relative;
  border: 1px solid ${colors.support.red};
  color: ${colors.support.red};
  padding: 1rem;
`;

const deleteButtonStyle = css`
  position: absolute;
  top: 0.1rem;
  right: 0.2rem;
  color: ${colors.support.red};
  &:hover,
  &:focus {
    color: ${darken(0.2, colors.support.red)};
  }
`;

const EditorErrorMessage = ({ msg, attributes, onRemoveClick, children }) => (
  <StyledEditorErrorMessage {...attributes}>
    {onRemoveClick && (
      <Button stripped onClick={onRemoveClick} className={deleteButtonStyle}>
        <Cross />
      </Button>
    )}
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
