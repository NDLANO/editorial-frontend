import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

const Summary = ({ attributes, children, node, editor }) => {
  return (
    <summary {...attributes}>
      <span
        style={{
          cursor: 'text',
          paddingRight: '200px',
        }}
        onClick={e => {
          e.preventDefault();
          editor.moveToEndOfNode(node).focus();
        }}>
        {children}
      </span>
    </summary>
  );
};

const StyledInput = styled.div`
  border: 1px solid #eff0f2;
  transition: border-color 100ms ease;
  border-radius: 4px;
  min-height: 52px;
  background: #fff;
  padding: 0 13px;
  height: 20px;
  margin: 14px 0;
`;

Summary.propTypes = {};

export default Summary;
