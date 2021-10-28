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
import { withTranslation } from 'react-i18next';
import VideoSearch from '@ndla/video-search';
import AudioSearch from '@ndla/audio-search';
import { actions as licenseActions, getAllLicenses } from '../../modules/license/license';
import {
  getImage,
  getUploadedImage,
  getSaving as getSavingImage,
  actions as imageActions,
} from '../../modules/image/image';
import { ImageShape } from '../../shapes';
import { getShowSaved } from '../Messages/messagesSelectors';
import config from '../../config';
import * as visualElementApi from './visualElementApi';
import * as imageApi from '../../modules/image/imageApi';
import H5PElement from '../../components/H5PElement/H5PElement';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import VisualElementUrlPreview from './VisualElementUrlPreview';
import FileUploader from '../../components/FileUploader';
import ImageSearchAndUploader from '../../components/ImageSearchAndUploader';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';

const titles = (t, resource = '') => ({
  [resource]: t(`form.visualElement.${resource.toLowerCase()}`),
});

class VisualElementSearch extends Component {
  componentDidUpdate() {
    const { uploadedImage, selectedResource, handleVisualElementChange } = this.props;
    if (uploadedImage) {
      const image = getImage(uploadedImage.id, true);
      handleVisualElementChange({
        resource: selectedResource,
        resource_id: uploadedImage.id,
        size: 'full',
        align: '',
        alt: uploadedImage.alttext.alttext,
        caption: uploadedImage.caption.caption,
        metaData: image,
      });
    }
  }

  componentWillUnmount() {
    const { uploadedImage, clearUploadedImage } = this.props;
    if (uploadedImage) {
      clearUploadedImage();
    }
  }

  render() {
    const {
      isSavingImage,
      selectedResource,
      selectedResourceUrl,
      selectedResourceType,
      setH5pFetchFail,
      handleVisualElementChange,
      closeModal,
      articleLanguage,
      videoTypes,
      i18n,
      showMetaImageCheckbox,
      onSaveAsMetaImage,
      t,
    } = this.props;
    const locale = i18n.language;
    const fetchImage = id => visualElementApi.fetchImage(id, articleLanguage);
    const [allowedUrlResource] = EXTERNAL_WHITELIST_PROVIDERS.map(provider => provider.name).filter(
      name => name === selectedResource,
    );
    switch (selectedResource) {
      case 'image':
        return (
          <ImageSearchAndUploader
            inModal={true}
            handleVisualElementChange={handleVisualElementChange}
            locale={locale}
            isSavingImage={isSavingImage}
            closeModal={closeModal}
            fetchImage={fetchImage}
            searchImages={imageApi.searchImages}
            onError={visualElementApi.onError}
            onImageSelect={image => {
              handleVisualElementChange({
                resource: selectedResource,
                resource_id: image.id,
                size: 'full',
                align: '',
                alt: convertFieldWithFallback(image, 'alttext', ''),
                caption: convertFieldWithFallback(image, 'caption', ''),
                metaData: image,
              });
            }}
            showMetaImageCheckbox={showMetaImageCheckbox}
            onSaveAsMetaImage={onSaveAsMetaImage}
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
          <Fragment>
            <h2>{titles(t, selectedResource)[selectedResource]}</h2>
            <VideoSearch
              enabledSources={videoTypes || ['Brightcove']}
              searchVideos={(query, type) => visualElementApi.searchVideos(query, type)}
              locale={locale}
              translations={videoTranslations}
              onVideoSelect={(video, type) => {
                if (type === 'youtube') {
                  handleVisualElementChange({
                    resource: 'external',
                    url: video.pagemap?.videoobject?.[0]?.url || video.link,
                    title: video.title,
                  });
                } else {
                  handleVisualElementChange({
                    resource: type,
                    videoid: video.id,
                    caption: '',
                    account: config.brightCoveAccountId,
                    player: config.brightcovePlayerId,
                    metaData: video,
                    title: video.name,
                  });
                }
              }}
              onError={visualElementApi.onError}
            />
          </Fragment>
        );
      }
      case 'H5P':
      case 'h5p': {
        return (
          <H5PElement
            canReturnResources={true}
            h5pUrl={selectedResourceUrl}
            onSelect={h5p =>
              handleVisualElementChange({
                resource: 'h5p',
                path: h5p.path,
                title: h5p.title,
                metaData: {},
              })
            }
            onClose={closeModal}
            locale={locale}
            setH5pFetchFail={setH5pFetchFail}
          />
        );
      }
      case 'audio':
      case 'podcast': {
        const audioType = selectedResource === 'audio' ? 'standard' : 'podcast';
        const defaultQueryObject = {
          query: '',
          page: 1,
          pageSize: 16,
          locale,
          audioType,
        };
        const fetchAudio = id => visualElementApi.fetchAudio(id, articleLanguage);

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
            fetchAudio={fetchAudio}
            searchAudios={visualElementApi.searchAudios}
            onAudioSelect={audio =>
              handleVisualElementChange({
                caption: '', // Caption not supported by audio-api
                resource: 'audio',
                resource_id: audio.id.toString(),
                type: audioType,
                url: audio.url,
                metaData: audio,
              })
            }
            onError={visualElementApi.onError}
            queryObject={defaultQueryObject}
          />
        );
      }
      case 'related-content': {
        handleVisualElementChange({ resource: 'related-content' });
        return null;
      }
      // URL-editable embed resources
      case 'url':
      case allowedUrlResource: {
        return (
          <VisualElementUrlPreview
            resource={allowedUrlResource}
            selectedResourceUrl={selectedResourceUrl}
            selectedResourceType={selectedResourceType}
            onUrlSave={handleVisualElementChange}
          />
        );
      }
      case 'file':
        return (
          <FileUploader
            onFileSave={files => {
              const preparedFiles = files.map(file => ({
                url: config.ndlaApiUrl + file.path,
                resource: 'file',
                ...file,
              }));
              handleVisualElementChange(preparedFiles, 'file');
            }}
            onClose={closeModal}
          />
        );
      default:
        return <h3>{`Embedtag ${selectedResource} is not supported.`}</h3>;
    }
  }
}

VisualElementSearch.propTypes = {
  selectedResource: PropTypes.string.isRequired,
  selectedResourceUrl: PropTypes.string,
  selectedResourceType: PropTypes.string,
  setH5pFetchFail: PropTypes.func,
  handleVisualElementChange: PropTypes.func.isRequired,
  articleLanguage: PropTypes.string.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string.isRequired,
  }).isRequired,
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
  closeModal: PropTypes.func,
  videoTypes: PropTypes.array,
  showMetaImageCheckbox: PropTypes.bool,
  onSaveAsMetaImage: PropTypes.func,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  clearUploadedImage: imageActions.clearUploadedImage,
};

const mapStateToProps = state => {
  return {
    licenses: getAllLicenses(state),
    isSavingImage: getSavingImage(state),
    showSaved: getShowSaved(state),
    uploadedImage: getUploadedImage(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(VisualElementSearch));
