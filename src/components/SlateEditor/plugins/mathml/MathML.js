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

export const MathML = props => {
  const { node } = props;

  const { innerHTML, xlmns } = node.data.toJS();
  return (
    <span contentEditable={false} {...props.attributes}>
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
    </span>
  );
};

MathML.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
};
