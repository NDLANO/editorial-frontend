/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'ndla-button';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import { Cross } from '@ndla/icons/action';
import { ChevronLeft } from '@ndla/icons/common';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const SlateRightAside = props => {
  const { children, onRemoveClick, onMoveContent, t, attributes } = props;

  return (
    <aside {...classes('right-aside', '', 'c-aside expanded')} {...attributes}>
      <div {...classes('aside-type')} contentEditable={false}>
        {t('learningResourceForm.fields.rightAside.title')}
      </div>
      <div className="c-aside__content">{children}</div>
      <Button
        title={t('learningResourceForm.fields.rightAside.delete')}
        stripped
        onClick={onRemoveClick}
        {...classes('delete-button')}>
        <Cross />
      </Button>
      <Button
        title={t('learningResourceForm.fields.rightAside.moveContent')}
        stripped
        onClick={onMoveContent}
        {...classes('move-content-button')}>
        <ChevronLeft />
      </Button>
    </aside>
  );
};

SlateRightAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
  onMoveContent: PropTypes.func.isRequired,
};

export default injectT(SlateRightAside);
