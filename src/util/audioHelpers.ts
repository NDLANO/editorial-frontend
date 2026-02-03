/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioMetaInformationDTO, SeriesDTO, CopyrightDTO } from "@ndla/types-backend/audio-api";
import { AudioFormikType, PodcastFormValues, PodcastSeriesFormikType } from "../modules/audio/audioTypes";
import { inlineContentToEditorValue, plainTextToEditorValue } from "./articleContentConverter";
import { DEFAULT_LICENSE } from "./formHelper";

export const audioApiTypeToFormType = (
  audio: AudioMetaInformationDTO | undefined,
  language: string,
): AudioFormikType => {
  const copyright: CopyrightDTO = audio?.copyright ?? {
    creators: [],
    processors: [],
    rightsholders: [],
    license: DEFAULT_LICENSE,
    processed: false,
  };
  const license = audio?.copyright.license.license;
  const audioLicense = !license || license === "unknown" ? DEFAULT_LICENSE.license : license;

  return {
    ...audio,
    title: plainTextToEditorValue(audio?.title?.title ?? ""),
    manuscript: inlineContentToEditorValue(audio?.manuscript?.manuscript ?? "", true),
    tags: audio?.tags.tags ?? [],
    ...copyright,
    origin: audio?.copyright.origin ?? "",
    license: audioLicense,
    audioFile: audio?.audioFile ? { storedFile: audio.audioFile } : {},
    language,
    supportedLanguages: audio?.supportedLanguages ?? [language],
  };
};

export const audioApiTypeToPodcastFormType = (
  audio: AudioMetaInformationDTO | undefined,
  language: string,
): PodcastFormValues => {
  return {
    ...audioApiTypeToFormType(audio, language),
    introduction: plainTextToEditorValue(audio?.podcastMeta?.introduction || ""),
    coverPhotoId: audio?.podcastMeta?.coverPhoto.id,
    metaImageAlt: audio?.podcastMeta?.coverPhoto.altText,
    filepath: "",
    series: audio?.series ?? null,
  };
};

export const podcastSeriesTypeToFormType = (
  series: SeriesDTO | undefined,
  language: string,
): PodcastSeriesFormikType => {
  return {
    ...series,
    language,
    coverPhotoId: series?.coverPhoto.id,
    metaImageAlt: series?.coverPhoto.altText,
    title: plainTextToEditorValue(series?.title.title ?? ""),
    description: plainTextToEditorValue(series?.description.description ?? ""),
    episodes: series?.episodes?.map((e) => e.id) ?? [],
    supportedLanguages: series?.supportedLanguages ?? [language],
    hasRSS: !!series?.hasRSS,
  };
};
