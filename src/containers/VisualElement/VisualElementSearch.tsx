/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import AudioSearch from '@ndla/audio-search';
import { IAudioSummary } from '@ndla/types-backend/audio-api';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { BrightcoveApiType } from '@ndla/types-embed';
import VideoSearch from '@ndla/video-search';
import VisualElementUrlPreview from './VisualElementUrlPreview';
import FileUploader from '../../components/FileUploader';
import ImageSearchAndUploader from '../../components/ImageSearchAndUploader';
import config from '../../config';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import { Embed, ExternalEmbed, H5pEmbed } from '../../interfaces';
import { fetchAudio, searchAudio } from '../../modules/audio/audioApi';
import { AudioSearchParams } from '../../modules/audio/audioApiInterfaces';
import { fetchImage, searchImages } from '../../modules/image/imageApi';
import { searchVideos, VideoSearchQuery } from '../../modules/video/brightcoveApi';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { onError } from '../../util/resolveJsonOrRejectWithError';

const titles = (t: TFunction, resource: string) => ({
  [resource]: t(`form.visualElement.${resource.toLowerCase()}`),
});

interface Props {
  selectedResource: string;
  selectedResourceUrl?: string;
  selectedResourceType?: string;
  handleVisualElementChange: (returnType: Embed | DOMStringMap[]) => void;
  articleLanguage?: string;
  closeModal: () => void;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
  embed?: H5pEmbed | ExternalEmbed;
}

interface LocalAudioSearchParams extends Omit<AudioSearchParams, 'audio-type' | 'page-size'> {
  audioType?: string;
  pageSize?: number;
  locale?: string;
}

const searchAudios = (query: LocalAudioSearchParams) => {
  // AudioSearch passes values that are not accepted by the API. They must be altered to have the correct key.
  const correctedQuery: AudioSearchParams = {
    language: query.language ?? query.locale,
    page: query.page,
    query: query.query,
    sort: query.sort,
    'page-size': 16,
    'audio-type': query.audioType,
  };
  return searchAudio(correctedQuery);
};

const VisualElementSearch = ({
  selectedResource,
  selectedResourceUrl,
  selectedResourceType,
  handleVisualElementChange,
  articleLanguage,
  closeModal,
  showCheckbox: showMetaImageCheckbox,
  checkboxAction: onSaveAsMetaImage,
  embed,
}: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [allowedUrlResource] = EXTERNAL_WHITELIST_PROVIDERS.map((provider) => provider.name).filter(
    (name) => name === selectedResource,
  );
  switch (selectedResource) {
    case 'image':
      return (
        <ImageSearchAndUploader
          inModal={true}
          locale={locale}
          language={articleLanguage}
          closeModal={closeModal}
          fetchImage={(id) => fetchImage(id, articleLanguage)}
          searchImages={searchImages}
          onError={onError}
          onImageSelect={(image) =>
            handleVisualElementChange({
              resource: selectedResource,
              resource_id: image.id,
              size: 'full',
              align: '',
              alt: convertFieldWithFallback<'alttext'>(image, 'alttext', ''),
              caption: convertFieldWithFallback<'caption'>(image, 'caption', ''),
              metaData: image,
            })
          }
          showCheckbox={showMetaImageCheckbox}
          checkboxAction={onSaveAsMetaImage}
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
        <>
          <h2>{titles(t, selectedResource)[selectedResource]}</h2>
          <VideoSearch
            enabledSources={['Brightcove']}
            searchVideos={(query: VideoSearchQuery) => searchVideos(query)}
            locale={locale}
            translations={videoTranslations}
            onVideoSelect={(video: BrightcoveApiType, type: 'brightcove') =>
              handleVisualElementChange({
                resource: type,
                videoid: video.id,
                caption: '',
                account: config.brightcoveAccountId!,
                player:
                  video.projection === 'equirectangular'
                    ? config.brightcove360PlayerId!
                    : video.custom_fields['license'] === 'Opphavsrett'
                      ? config.brightcoveCopyrightPlayerId!
                      : config.brightcovePlayerId!,
                metaData: video,
                title: video.name ?? '',
              })
            }
            onError={onError}
          />
        </>
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

      const translations = {
        searchPlaceholder: t('audioSearch.searchPlaceholder'),
        searchButtonTitle: t('audioSearch.searchButtonTitle'),
        useAudio: t('audioSearch.useAudio'),
        noResults: t('audioSearch.noResults'),
      };

      return (
        <AudioSearch
          translations={translations}
          fetchAudio={(id: number) => fetchAudio(id, articleLanguage ?? locale)}
          searchAudios={searchAudios}
          onAudioSelect={(audio: IAudioSummary) =>
            handleVisualElementChange({
              resource: 'audio',
              resourceId: audio.id.toString(),
              type: audioType,
              url: audio.url,
            })
          }
          onError={onError}
          queryObject={defaultQueryObject}
        />
      );
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
          articleLanguage={articleLanguage}
          embed={embed?.resource === 'external' || embed?.resource === 'iframe' ? embed : undefined}
        />
      );
    }
    case 'file':
      return (
        <FileUploader
          onFileSave={(files) => {
            const preparedFiles = files.map((file) => ({
              url: config.ndlaApiUrl + file.path,
              resource: 'file',
              ...file,
            }));
            handleVisualElementChange(preparedFiles);
          }}
        />
      );
    default:
      return <h3>{`Embedtag ${selectedResource} is not supported.`}</h3>;
  }
};

export default VisualElementSearch;
