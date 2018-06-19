/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Button } from 'ndla-ui';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-icons/action';
import { injectT } from 'ndla-i18n';
import Overlay from './Overlay';
import Spinner from './Spinner';

export const classes = new BEMHelper({
  name: 'taxonomy-lightbox',
  prefix: 'c-',
});

const TaxonomyLightbox = ({
  children,
  title,
  onSelect,
  t,
  loading,
  onClose,
}) => (
  <div {...classes()}>
    <Overlay onExit={onClose} />
    <div {...classes('wrapper')}>
      <div {...classes('header')}>
        {title}
        <Button {...classes('close')} stripped onClick={onClose}>
          <Cross />
        </Button>
      </div>
      <div {...classes('content')}>
        {children}
        {onSelect && (
          <Button
            data-testid="taxonomyLightboxButton"
            stripped
            {...classes('select-button')}
            onClick={onSelect}>
            {loading ? <Spinner cssModifier="small" /> : t('form.choose')}
          </Button>
        )}
      </div>
    </div>
  </div>
);

TaxonomyLightbox.propTypes = {
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  title: PropTypes.string,
  onSelect: PropTypes.func,
};

export default injectT(TaxonomyLightbox);
