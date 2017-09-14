/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

const Footnote = props => {
  const { attributes } = props;

  return (
    <a {...attributes}>
      <sup>
        {props.children}
      </sup>
    </a>
  );
};

Footnote.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default function footnotePlugin() {
  const schema = {
    nodes: {
      footnote: Footnote,
    },
  };
  return {
    schema,
  };
}
