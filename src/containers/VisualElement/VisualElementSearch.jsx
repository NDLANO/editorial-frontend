/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ImageSearch from 'ndla-image-search';
import VideoSearch from 'ndla-video-search';
import * as api from './visualElementApi';
import { injectT } from '../../i18n';
import { getLocale } from '../../modules/locale/locale';

const titles = {
  video: 'Videosøk',
  image: 'Bildesøk',
};

const VisualElementSearch = ({
  embedTag,
  handleVisualElementChange,
  locale,
  t,
}) => {
  const videoTranslations = {
    searchPlaceholder: 'Søk i videoer',
    searchButtonTitle: 'Søk',
    loadMoreVideos: 'Last flere videor',
    noResults: 'Ingen videor funnet.',
    addVideo: 'Bruk video',
    previewVideo: 'Forhåndsvis',
  };

  switch (embedTag.resource) {
    case 'image':
      return (
        <div>
          <h2>{titles[embedTag.resource]}</h2>
          <ImageSearch
            fetchImage={api.fetchImage}
            searchImages={api.searchImages}
            locale={locale}
            searchPlaceholder={t('imageSearch.placeholder')}
            searchButtonTitle={t('imageSearch.buttonTitle')}
            onImageSelect={handleVisualElementChange}
            onError={api.onError}
          />
        </div>
      );
    case 'video':
      return (
        <div>
          <h2>{titles[embedTag.resource]}</h2>
          <VideoSearch
            fetchVideo={api.fetchBrightcoveVideo}
            searchVideos={api.searchBrightcoveVideos}
            locale={locale}
            translations={videoTranslations}
            onVideoSelect={handleVisualElementChange}
            onError={api.onError}
          />
        </div>
      );
    default:
      return <p>{`Embedtag ${embedTag.resource} is not supported.`}</p>;
  }
};

VisualElementSearch.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  handleVisualElementChange: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(VisualElementSearch));
