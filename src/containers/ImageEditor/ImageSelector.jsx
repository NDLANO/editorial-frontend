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
import { connect } from 'react-redux';
import ImageSearch from 'ndla-image-search';
import * as api from '../VisualElement/visualElementApi';
import { getLocale } from '../../modules/locale/locale';

const ImageSelector = ({ handleImageSelect, locale, t }) =>
  <div>
    <h2>Bildesøk</h2>
    <ImageSearch
      fetchImage={api.fetchImage}
      searchImages={api.searchImages}
      locale={locale}
      searchPlaceholder={t('imageSearch.placeholder')}
      searchButtonTitle={t('imageSearch.buttonTitle')}
      onImageSelect={handleImageSelect}
      onError={api.onError}
    />
  </div>;

ImageSelector.propTypes = {
  handleImageSelect: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(ImageSelector));
