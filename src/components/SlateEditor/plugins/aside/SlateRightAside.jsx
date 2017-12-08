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
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-icons/action';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const SlateRightAside = props => {
  const { children, onRemoveClick, t, attributes } = props;

  return (
    <aside {...classes('right-aside', '', 'c-aside expanded')} {...attributes}>
      <div {...classes('aside-type')} contentEditable={false}>
        {t('learningResourceForm.fields.rightAside')}
      </div>
      <div className="c-aside__content">{children}</div>
      <Button
        stripped
        onClick={onRemoveClick}
        {...classes('delete-aside-button')}>
        <Cross />
      </Button>
    </aside>
  );
};

SlateRightAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
};

export default injectT(SlateRightAside);
