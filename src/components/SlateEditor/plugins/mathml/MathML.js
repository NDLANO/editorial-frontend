/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import styled from 'react-emotion';
import { colors, spacing } from 'ndla-core';
import { EditorShape } from '../../../../shapes';
import { EditorDeleteButton } from '../../common/EditorDeleteButton';

const StyledMathWrapper = styled('span')`
  display: inline-block;
  border: 1px solid ${colors.brand.default};
  padding: ${spacing.xsmall};
`;

export const MathML = props => {
  const { node, editor } = props;

  const onRemoveClick = () => {
    const next = editor.value.change().removeNodeByKey(node.key);
    editor.onChange(next);
  };

  const { innerHTML, xlmns } = node.data.toJS();
  return (
    <StyledMathWrapper {...props.attributes}>
      <math
        xlmns={xlmns}
        dangerouslySetInnerHTML={{
          __html: innerHTML,
        }}
      />
      <EditorDeleteButton
        onClick={onRemoveClick}
        style={{ position: 'relative', marginLeft: spacing.small, top: 0 }}
      />
    </StyledMathWrapper>
  );
};

MathML.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};
