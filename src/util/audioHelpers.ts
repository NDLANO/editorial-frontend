/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IAudioMetaInformation as AudioApiType,
} from "@ndla/types-audio-api";
import { convertFieldWithFallback } from './convertFieldWithFallback';
import {
  PodcastFormValues,
  PodcastSeriesApiType,
} from '../modules/audio/audioApiInterfaces';
import { AudioFormikType } from '../containers/AudioUploader/components/AudioForm';
import { plainTextToEditorValue } from './articleContentConverter';
import { DEFAULT_LICENSE } from './formHelper';
import { Copyright } from '../interfaces';
import { PodcastSeriesFormikType } from '../containers/PodcastSeries/components/PodcastSeriesForm';

const convertNestedAudioProps = (audio: AudioApiType | undefined, language: string) => {
  if (audio) {
    const audioLanguage = audio.supportedLanguages.includes(language) ? language : undefined;
    return {
      title: convertFieldWithFallback<'title'>(audio, 'title', '', audioLanguage),
      manuscript: convertFieldWithFallback<'manuscript'>(audio, 'manuscript', '', audioLanguage),
      tags: convertFieldWithFallback<'tags', string[]>(audio, 'tags', [], audioLanguage),
    };
  }
  return { title: '', manuscript: '', tags: [] as string[] };
};

export const audioApiTypeToFormType = (
  audio: AudioApiType | undefined,
  language: string,
): AudioFormikType => {
  const { title, manuscript, tags } = convertNestedAudioProps(audio, language);

  const copyright: Copyright = audio?.copyright ?? {
    creators: [],
    processors: [],
    rightsholders: [],
  };

  return {
    ...audio,
    title: plainTextToEditorValue(title),
    manuscript: plainTextToEditorValue(manuscript),
    tags: Array.from(new Set(tags)),
    ...copyright,
    origin: audio?.copyright.origin ?? '',
    license: audio?.copyright?.license?.license || DEFAULT_LICENSE.license,
    audioFile: audio?.audioFile ? { storedFile: audio.audioFile } : {},
    language,
    supportedLanguages: audio?.supportedLanguages ?? [language],
  };
};

export const audioApiTypeToPodcastFormType = (
  audio: AudioApiType | undefined,
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
  series: PodcastSeriesApiType | undefined,
  language: string,
): PodcastSeriesFormikType => {
  const title = series ? convertFieldWithFallback<'title'>(series, 'title', '', language) : '';
  const description = series
    ? convertFieldWithFallback<'description'>(series, 'description', '', language)
    : '';
  return {
    ...series,
    language,
    coverPhotoId: series?.coverPhoto.id,
    metaImageAlt: series?.coverPhoto.altText,
    title: plainTextToEditorValue(title),
    description: plainTextToEditorValue(description),
    episodes: series?.episodes ?? [],
    supportedLanguages: series?.supportedLanguages ?? [language],
  };
};
