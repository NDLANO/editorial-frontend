/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import ImageSearch from 'ndla-image-search';
import VideoSearch from 'ndla-video-search';
import AudioSearch from 'ndla-audio-search';
import Tabs from 'ndla-tabs';

import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getSaving as getSavingAudio } from '../../modules/audio/audio';
import {
  getImage,
  getUploadedImage,
  getSaving as getSavingImage,
  actions as imageActions,
} from '../../modules/image/image';
import { ImageShape } from '../../shapes';
import { getShowSaved } from '../Messages/messagesSelectors';

import EditImage from '../ImageUploader/EditImage';

import config from '../../config';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import * as api from './visualElementApi';
import { getLocale } from '../../modules/locale/locale';
import H5PElement from '../../components/H5PElement';

const titles = t => ({
  video: t('form.visualElement.video'),
  image: t('form.visualElement.image'),
  h5p: t('form.visualElement.h5p'),
});

class VisualElementSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
    this.changeTabIndex = this.changeTabIndex.bind(this);
  }

  componentDidUpdate() {
    if (this.props.uploadedImage) {
      const image = getImage(this.props.uploadedImage.id, true);
      this.props.handleVisualElementChange({
        resource: this.props.selectedResource,
        resource_id: this.props.uploadedImage.id,
        size: 'fullbredde',
        align: '',
        alt: this.props.uploadedImage.alttext.alttext,
        caption: this.props.uploadedImage.caption.caption,
        metaData: image,
      });
    }
  }

  componentWillUnmount() {
    if (this.props.uploadedImage) {
      // clear uploadedImage.
      this.props.clearUploadedImage();
    }
  }

  changeTabIndex(selectedIndex) {
    this.setState({
      selectedIndex,
    });
  }

  render() {
    const {
      isSavingImage,
      selectedResource,
      selectedResourceUrl,
      handleVisualElementChange,
      locale,
      t,
    } = this.props;

    switch (selectedResource) {
      case 'image':
        return (
          <Tabs
            onSelect={selectedIndex => {
              this.setState({
                selectedIndex,
              });
            }}
            selectedIndex={this.state.selectedIndex}
            tabs={[
              {
                title: titles(t)[selectedResource],
                content: (
                  <ImageSearch
                    fetchImage={api.fetchImage}
                    searchImages={api.searchImages}
                    locale={locale}
                    searchPlaceholder={t('imageSearch.placeholder')}
                    searchButtonTitle={t('imageSearch.buttonTitle')}
                    useImageTitle={t('imageSearch.useImage')}
                    onImageSelect={image =>
                      handleVisualElementChange({
                        resource: selectedResource,
                        resource_id: image.id,
                        size: 'fullbredde',
                        align: '',
                        alt: convertFieldWithFallback(image, 'alttext', ''),
                        caption: convertFieldWithFallback(image, 'caption', ''),
                        metaData: image,
                      })
                    }
                    noResults={
                      <Fragment>
                        <div style={{ marginBottom: '20px' }}>
                          {t('imageSearch.noResultsText')}
                        </div>
                        <Button
                          submit
                          outline
                          onClick={() => {
                            this.setState({
                              selectedIndex: 1,
                            });
                          }}>
                          {t('imageSearch.noResultsButtonText')}
                        </Button>
                      </Fragment>
                    }
                    onError={api.onError}
                  />
                ),
              },
              {
                title: t('form.visualElement.imageUpload'),
                content: (
                  <EditImage
                    isSaving={isSavingImage}
                    showSaved={false}
                    inModal
                    editingArticle
                  />
                ),
              },
            ]}
          />
        );
      case 'video': {
        const videoTranslations = {
          searchPlaceholder: t('videoSearch.searchPlaceholder'),
          searchButtonTitle: t('videoSearch.searchButtonTitle'),
          loadMoreVideos: t('videoSearch.loadMoreVideos'),
          noResults: t('videoSearch.noResults'),
          addVideo: t('videoSearch.addVideo'),
          previewVideo: t('videoSearch.previewVideo'),
          publishedDate: t('videoSearch.publishedDate'),
          duration: t('videoSearch.duration'),
          interactioncount: t('videoSearch.interactioncount'),
        };
        return (
          <div>
            <h2>{titles(t)[selectedResource]}</h2>
            <VideoSearch
              enabledSources={['Brightcove', 'YouTube']}
              searchVideos={(query, type) => api.searchVideos(query, type)}
              locale={locale}
              translations={videoTranslations}
              onVideoSelect={(video, type) => {
                if (type === 'youtube') {
                  handleVisualElementChange({
                    resource: 'external',
                    url: video.link,
                  });
                } else {
                  handleVisualElementChange({
                    resource: type,
                    videoid: video.id,
                    caption: '',
                    account: config.brightCoveAccountId,
                    player: config.brightcovePlayerId,
                    metaData: video,
                  });
                }
              }}
              onError={api.onError}
            />
          </div>
        );
      }
      case 'h5p': {
        return (
          <div>
            <h2>{titles(t)[selectedResource]}</h2>
            <H5PElement
              h5pUrl={selectedResourceUrl}
              onSelect={h5p =>
                handleVisualElementChange({
                  resource: 'external',
                  ...h5p,
                  metaData: {},
                })
              }
              label={t('form.visualElement.label')}
            />
          </div>
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
            onAudioSelect={audio =>
              handleVisualElementChange({
                caption: '', // Caption not supported by audio-api
                resource: selectedResource,
                resource_id: audio.id.toString(),
                type: 'standard',
                url: audio.url,
                metaData: audio,
              })
            }
            onError={api.onError}
            queryObject={defaultQueryObject}
          />
        );
      }
      case 'related-content': {
        handleVisualElementChange({ resource: 'related-content' });
        return null;
      }
      default:
        return <p>{`Embedtag ${selectedResource} is not supported.`}</p>;
    }
  }
}

VisualElementSearch.propTypes = {
  selectedResource: PropTypes.string.isRequired,
  selectedResourceUrl: PropTypes.string,
  handleVisualElementChange: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  uploadedImage: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    alttext: PropTypes.shape({
      alttext: PropTypes.string,
    }),
    caption: PropTypes.shape({
      caption: PropTypes.string,
    }),
  }),
  isSavingImage: PropTypes.bool,
  image: ImageShape,
  clearUploadedImage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchTags: tagActions.fetchTags,
  fetchLicenses: licenseActions.fetchLicenses,
  clearUploadedImage: imageActions.clearUploadedImage,
};

const mapStateToProps = state => {
  const locale = getLocale(state);
  const getAllTagsSelector = getAllTagsByLanguage(locale);
  return {
    locale,
    tags: getAllTagsSelector(state),
    licenses: getAllLicenses(state),
    isSavingAudio: getSavingAudio(state),
    isSavingImage: getSavingImage(state),
    showSaved: getShowSaved(state),
    uploadedImage: getUploadedImage(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectT(VisualElementSearch));
