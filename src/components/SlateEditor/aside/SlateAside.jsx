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
import SlateTextAside from './SlateTextAside';

const SlateAside = props => {
  const { node, editor } = props;

  const onRemoveClick = () => {
    const next = editor
      .getState()
      .transform()
      .removeNodeByKey(node.key)
      .apply();
    editor.onChange(next);
  };
  const type = node.get('data').get('type');
  switch (type) {
    case 'rightAside':
      return <SlateRightAside onRemoveClick={onRemoveClick} {...props} />;
    case 'factAside':
      return <SlateFactAside onRemoveClick={onRemoveClick} {...props} />;
    case 'textAside':
      return <SlateTextAside onRemoveClick={onRemoveClick} {...props} />;
    default: {
      return <SlateFactAside onRemoveClick={onRemoveClick} {...props} />;
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
  editor: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  }),
};

export default SlateAside;
