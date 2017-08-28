/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-ui/icons';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const SlateTextAside = props => {
  const { children, onRemoveClick } = props;

  return (
    <aside {...classes('text-aside', '', 'c-aside expanded')}>
      <div className="c-aside__content">
        {children}
      </div>
      <Button
        stripped
        onClick={onRemoveClick}
        {...classes('delete-aside-button')}>
        <Cross />
      </Button>
    </aside>
  );
};

SlateTextAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
};

export default SlateTextAside;
