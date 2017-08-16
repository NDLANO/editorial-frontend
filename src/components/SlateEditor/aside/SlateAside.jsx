/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import SlateRightAside from './SlateRightAside';

const SlateAside = props => {
  const { node } = props;

  const type = node.get('data').get('type');

  switch (type) {
    case 'rightAside':
      return <SlateRightAside {...props} />;
    default: {
      return (
        <aside className="c-aside" {...props.attributes}>{props.children}</aside>
      );
    }
  }
};

SlateAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: PropTypes.object.isRequired,
};

export default SlateAside;
