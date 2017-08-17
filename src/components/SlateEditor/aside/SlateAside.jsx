/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SlateRightAside from './SlateRightAside';
import SlateFactAside from './SlateFactAside';

const SlateAside = props => {
  const { node } = props;

  const type = node.get('data').get('type');
  switch (type) {
    case 'rightAside':
      return <SlateRightAside {...props} />;
    case 'factAside':
      return <SlateFactAside {...props} />;
    default: {
      return <SlateFactAside {...props} />;
    }
  }
};

SlateAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
};

export default SlateAside;
