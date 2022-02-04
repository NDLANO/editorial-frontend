/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction, useTranslation } from 'react-i18next';
import VideoSearch from '@ndla/video-search';
import AudioSearch from '@ndla/audio-search';
import config from '../../config';
import H5PElement from '../../components/H5PElement/H5PElement';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import VisualElementUrlPreview from './VisualElementUrlPreview';
import ImageSearchAndUploader from '../../components/ImageSearchAndUploader';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { ImageApiType } from '../../modules/image/imageApiInterfaces';
import { fetchImage, searchImages } from '../../modules/image/imageApi';
import { fetchAudio } from '../../modules/audio/audioApi';
import { onError } from '../../util/resolveJsonOrRejectWithError';
import {
  BrightcoveApiType,
  searchVideos,
  VideoSearchQuery,
} from '../../modules/video/brightcoveApi';
import { AudioSearchParams, AudioSearchResultType } from '../../modules/audio/audioApiInterfaces';
import { searchAudio } from '../../modules/audio/audioApi';
import { Embed } from '../../interfaces';
import FileUploader from '../../components/FileUploader';

const titles = (t: TFunction, resource: string) => ({
  [resource]: t(`form.visualElement.${resource.toLowerCase()}`),
});

interface ReturnType<TType, TReturnType> {
  type: TType;
  value: TReturnType;
}

type EmbedReturnType = ReturnType<'embed', Embed>;
type FileReturnType = ReturnType<'file', DOMStringMap[]>;
export type VisualElementChangeReturnType = EmbedReturnType | FileReturnType;

interface Props {
  selectedResource: string;
  selectedResourceUrl?: string;
  selectedResourceType?: string;
  setH5pFetchFail?: (failed: boolean) => void;
  handleVisualElementChange: (returnType: VisualElementChangeReturnType) => void;
  articleLanguage?: string;
  closeModal: () => void;
  showCheckbox?: boolean;
  checkboxAction?: (image: ImageApiType) => void;
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
  setH5pFetchFail,
  handleVisualElementChange,
  articleLanguage,
  closeModal,
  showCheckbox: showMetaImageCheckbox,
  checkboxAction: onSaveAsMetaImage,
}: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [allowedUrlResource] = EXTERNAL_WHITELIST_PROVIDERS.map(provider => provider.name).filter(
    name => name === selectedResource,
  );
  switch (selectedResource) {
    case 'image':
      return (
        <ImageSearchAndUploader
          inModal={true}
          locale={locale}
          closeModal={closeModal}
          fetchImage={id => fetchImage(id, articleLanguage)}
          searchImages={searchImages}
          onError={onError}
          onImageSelect={image => {
            handleVisualElementChange({
              type: 'embed',
              value: {
                resource: selectedResource,
                resource_id: image.id,
                size: 'full',
                align: '',
                alt: convertFieldWithFallback<'alttext'>(image, 'alttext', ''),
                caption: convertFieldWithFallback<'caption'>(image, 'caption', ''),
                metaData: image,
              },
            });
          }}
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
            onVideoSelect={(video: BrightcoveApiType, type: 'brightcove') => {
              handleVisualElementChange({
                type: 'embed',
                value: {
                  resource: type,
                  videoid: video.id,
                  caption: '',
                  account: config.brightCoveAccountId!,
                  player:
                    video.projection === 'equirectangular'
                      ? config.brightcove360PlayerId!
                      : config.brightcovePlayerId!,
                  metaData: video,
                  title: video.name,
                },
              });
            }}
            onError={onError}
          />
        </>
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
              type: 'embed',
              value: {
                resource: 'h5p',
                path: h5p.path!,
                title: h5p.title,
              },
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
          fetchAudio={(id: number) => fetchAudio(id, articleLanguage ?? locale)}
          searchAudios={searchAudios}
          onAudioSelect={(audio: AudioSearchResultType) =>
            handleVisualElementChange({
              type: 'embed',
              value: {
                resource: 'audio',
                resource_id: audio.id.toString(),
                type: audioType,
                url: audio.url,
              },
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
            handleVisualElementChange({ type: 'file', value: preparedFiles });
          }}
        />
      );
    default:
      return <h3>{`Embedtag ${selectedResource} is not supported.`}</h3>;
  }
};

export default VisualElementSearch;
