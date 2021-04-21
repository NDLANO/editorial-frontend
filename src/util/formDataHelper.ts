/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { NewImageMetadata, UpdatedImageMetadata } from '../modules/image/imageApiInterfaces';


import {
  NewAudioMetaInformation,
  UpdatedAudioMetaInformation,
  NewPodcastMetaInformation,
  UpdatedPodcastMetaInformation
} from '../modules/audio/audioApiInterfaces';

export const createFormData = (
  file?: string | Blob,
  metadata?:
    | NewImageMetadata
    | UpdatedImageMetadata
    | NewAudioMetaInformation
    | UpdatedAudioMetaInformation
    | NewPodcastMetaInformation
    | UpdatedPodcastMetaInformation,
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

  // TODO!!! Remove
// export const createAudioFormData = (
//   file: string | Blob,
//   metadata: NewAudioMetaInformation,
// ): Promise<FormData> =>
//   new Promise(resolve => {
//     const form = new FormData();
//     if (metadata) {
//       form.append('metadata', JSON.stringify(metadata));
//     }
//     form.append('file', file);
//     resolve(form);
//   });
