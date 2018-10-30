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
import { EditorShape } from '../../../../shapes';

const StyledMathWrapper = styled('span')`
  /* Don't know if this is necessary (copied from ndla-frontend) */
  .MJXc-display {
    display: inline-block !important;
    margin: 0;

    & .mjx-chtml {
      padding: 0;
    }
  }
`;

export const MathML = props => {
  const { node } = props;

  const { innerHTML, xlmns } = node.data.toJS();
  return (
    <StyledMathWrapper contentEditable={false} {...props.attributes}>
      {node.nodes.map(text => (
        <span key={text.key} data-key={text.key}>
          <math
            xlmns={xlmns}
            dangerouslySetInnerHTML={{
              __html: innerHTML,
            }}
          />
        </span>
      ))}
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
