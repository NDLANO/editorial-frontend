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
import { injectT } from 'ndla-i18n';
import ImageSearch from 'ndla-image-search';
import VideoSearch from 'ndla-video-search';
import AudioSearch from 'ndla-audio-search';

import { alttextsI18N, captionsI18N } from '../../util/i18nFieldFinder';
import * as api from './visualElementApi';
import { getLocale } from '../../modules/locale/locale';
import H5PSearch from '../../components/H5PSearch';

const titles = {
  video: 'Videosøk',
  image: 'Bildesøk',
};

const VisualElementSearch = ({
  selectedResource,
  handleVisualElementChange,
  locale,
  t,
}) => {
  switch (selectedResource) {
    case 'image':
      return (
        <div>
          <h2>
            {titles[selectedResource]}
          </h2>
          <ImageSearch
            fetchImage={api.fetchImage}
            searchImages={api.searchImages}
            locale={locale}
            searchPlaceholder={t('imageSearch.placeholder')}
            searchButtonTitle={t('imageSearch.buttonTitle')}
            onImageSelect={image =>
              handleVisualElementChange({
                resource_id: image.id,
                size: 'fullbredde',
                align: '',
                alt: alttextsI18N(image, locale, true),
                caption: captionsI18N(image, locale, true),
                metaData: image,
              })}
            onError={api.onError}
          />
        </div>
      );
    case 'brightcove': {
      const videoTranslations = {
        searchPlaceholder: t('videoSearch.searchPlaceholder'),
        searchButtonTitle: t('videoSearch.searchButtonTitle'),
        loadMoreVideos: t('videoSearch.loadMoreVideos'),
        noResults: t('videoSearch.noResults'),
        addVideo: t('videoSearch.addVideo'),
        previewVideo: t('videoSearch.previewVideo'),
      };
      return (
        <div>
          <h2>
            {titles[selectedResource]}
          </h2>
          <VideoSearch
            fetchVideo={api.fetchBrightcoveVideo}
            searchVideos={api.searchBrightcoveVideos}
            locale={locale}
            translations={videoTranslations}
            onVideoSelect={video =>
              handleVisualElementChange({
                videoid: video.id,
                caption: '',
                metaData: video,
              })}
            onError={api.onError}
          />
        </div>
      );
    }
    case 'h5p': {
      return (
        <H5PSearch
          onSelect={h5p =>
            handleVisualElementChange({
              ...h5p,
              metaData: {},
            })}
          label={t('topicArticleForm.fields.visualElement.label')}
        />
      );
    }
    case 'audio': {
      const defaultQueryObject = {
        query: '',
        page: 1,
        pageSize: 16,
        locale,
      };

      const translations = {
        searchPlaceholder: t('audioSearch.searchPlaceholder'),
        searchButtonTitle: t('audioSearch.searchButtonTitle'),
        useAudio: t('audioSearch.useAudio'),
        noResults: t('audioSearch.noResults'),
      };

      return (
        <AudioSearch
          translations={translations}
          locale={locale}
          fetchAudio={api.fetchAudio}
          searchAudios={api.searchAudios}
          onAudioSelect={handleVisualElementChange}
          onError={api.onError}
          queryObject={defaultQueryObject}
        />
      );
    }
    default:
      return <p>{`Embedtag ${selectedResource} is not supported.`}</p>;
  }
};

VisualElementSearch.propTypes = {
  selectedResource: PropTypes.string.isRequired,
  handleVisualElementChange: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(VisualElementSearch));
