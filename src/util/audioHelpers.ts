/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IAudioMetaInformation,
  ISeries,
  ICopyright,
} from '@ndla/types-audio-api';
import { PodcastFormValues } from '../modules/audio/audioApiInterfaces';
import { AudioFormikType } from '../containers/AudioUploader/components/AudioForm';
import { plainTextToEditorValue } from './articleContentConverter';
import { DEFAULT_LICENSE } from './formHelper';
import { PodcastSeriesFormikType } from '../containers/PodcastSeries/components/PodcastSeriesForm';

export const audioApiTypeToFormType = (
  audio: IAudioMetaInformation | undefined,
  language: string,
): AudioFormikType => {
  const copyright: ICopyright = audio?.copyright ?? {
    creators: [],
    processors: [],
    rightsholders: [],
    license: DEFAULT_LICENSE,
  };

  return {
    ...audio,
    title: plainTextToEditorValue(audio?.title?.title ?? ''),
    manuscript: plainTextToEditorValue(audio?.manuscript?.manuscript ?? ''),
    tags: audio?.tags.tags ?? [],
    ...copyright,
    origin: audio?.copyright.origin ?? '',
    license: audio?.copyright?.license?.license || DEFAULT_LICENSE.license,
    audioFile: audio?.audioFile ? { storedFile: audio.audioFile } : {},
    language,
    supportedLanguages: audio?.supportedLanguages ?? [language],
  };
};

export const audioApiTypeToPodcastFormType = (
  audio: IAudioMetaInformation | undefined,
  language: string,
): PodcastFormValues => {
  return {
    ...audioApiTypeToFormType(audio, language),
    introduction: plainTextToEditorValue(audio?.podcastMeta?.introduction || ''),
    coverPhotoId: audio?.podcastMeta?.coverPhoto.id,
    metaImageAlt: audio?.podcastMeta?.coverPhoto.altText,
    filepath: '',
    series: audio?.series ?? null,
  };
};

export const podcastSeriesTypeToFormType = (
  series: ISeries | undefined,
  language: string,
): PodcastSeriesFormikType => {
  return {
    ...series,
    language,
    coverPhotoId: series?.coverPhoto.id,
    metaImageAlt: series?.coverPhoto.altText,
    title: plainTextToEditorValue(series?.title.title ?? ''),
    description: plainTextToEditorValue(series?.description.description ?? ''),
    episodes: series?.episodes ?? [],
    supportedLanguages: series?.supportedLanguages ?? [language],
  };
};
