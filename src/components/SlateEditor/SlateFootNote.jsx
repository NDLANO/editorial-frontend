/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

const SlateFootnote = props => {
  const { attributes } = props;
  const { data } = props.node;

  const href = data.get('href') ? data.get('href').value : null;
  const name = data.get('name') ? data.get('name').value : null;

  return (
    <a href={href} name={name} {...attributes}>
      <sup id={name}>
        {props.children}
      </sup>
    </a>
  );
};

SlateFootnote.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
};

export default SlateFootnote;
