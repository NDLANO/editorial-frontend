/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  INewImageMetaInformationV2 as NewImageMetadata,
  IUpdateImageMetaInformation as UpdatedImageMetadata,
} from '@ndla/types-image-api';
import {
  AudioMetaInformationPost,
  AudioMetaInformationPut,
  PodcastMetaInformationPost,
  PodcastMetaInformationPut,
} from '../modules/audio/audioApiInterfaces';

export const createFormData = (
  file?: string | Blob,
  metadata?:
    | NewImageMetadata
    | UpdatedImageMetadata
    | AudioMetaInformationPost
    | AudioMetaInformationPut
    | PodcastMetaInformationPost
    | PodcastMetaInformationPut,
): Promise<FormData> =>
  new Promise(resolve => {
    const form = new FormData();
    if (metadata) {
      form.append('metadata', JSON.stringify(metadata));
    }
    if (file) {
      form.append('file', file);
    }
    resolve(form);
  });
