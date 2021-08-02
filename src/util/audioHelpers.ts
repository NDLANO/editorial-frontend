/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import _ from 'lodash';
import { convertFieldWithFallback } from './convertFieldWithFallback';
import {
  AudioApiType,
  FlattenedAudioApiType,
  FlattenedPodcastSeries,
  PodcastSeriesApiType,
} from '../modules/audio/audioApiInterfaces';

export const transformAudio = (
  audio: AudioApiType,
  language: string,
): FlattenedAudioApiType | undefined => {
  if (_.isEmpty(audio)) {
    return undefined;
  }

  const audioLanguage =
    audio && audio.supportedLanguages && audio.supportedLanguages.includes(language)
      ? language
      : undefined;

  const title = convertFieldWithFallback<'title'>(audio, 'title', '', audioLanguage);
  const manuscript = convertFieldWithFallback<'manuscript'>(audio, 'manuscript', '', audioLanguage);
  const tags = convertFieldWithFallback<'tags', string[]>(audio, 'tags', [], audioLanguage);

  return {
    ...audio,
    title,
    manuscript,
    tags,
  };
};

export const transformSeries = (
  series: PodcastSeriesApiType,
  language: string,
): FlattenedPodcastSeries | undefined => {
  if (_.isEmpty(series)) {
    return undefined;
  }

  const seriesLanguage = series.supportedLanguages.includes(language) ? language : undefined;
  const title = convertFieldWithFallback<'title'>(series, 'title', '', seriesLanguage);
  const description = convertFieldWithFallback<'description'>(
    series,
    'description',
    '',
    seriesLanguage,
  );

  return {
    ...series,
    title,
    description,
  };
};
