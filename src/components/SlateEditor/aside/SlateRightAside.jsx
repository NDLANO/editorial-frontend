/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'ndla-ui'
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const SlateRightAside = (props) => {
  const { children, node, editor } = props;

  const onRemoveClick = () => {
    const next = editor
      .getState()
      .transform()
      .removeNodeByKey(node.key)
      .apply();
    editor.onChange(next);
  };

  return (
    <aside {...classes("right-aside", "", "c-aside expanded")}>
      <div className="c-aside__content">
        {children}
      </div>
      <Button stripped onClick={onRemoveClick} {...classes('delete-aside-button')}>X</Button>
    </aside>
  )
};

SlateRightAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: PropTypes.shape({
    key: PropTypes.number.isRequired,
  }),
  editor: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  })
};

export default SlateRightAside;
