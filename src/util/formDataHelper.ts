/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { INewAudioMetaInformation, IUpdatedAudioMetaInformation } from "@ndla/types-backend/audio-api";
import { INewImageMetaInformationV2, IUpdateImageMetaInformation } from "@ndla/types-backend/image-api";

export const createFormData = (
  file?: string | Blob,
  metadata?:
    | INewImageMetaInformationV2
    | IUpdateImageMetaInformation
    | INewAudioMetaInformation
    | IUpdatedAudioMetaInformation,
): Promise<FormData> =>
  new Promise((resolve) => {
    const form = new FormData();
    if (metadata) {
      form.append("metadata", JSON.stringify(metadata));
    }
    if (file) {
      form.append("file", file);
    }
    resolve(form);
  });
