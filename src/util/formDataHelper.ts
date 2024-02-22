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
    // If the file is a string, it is a URL to existing data, that didn't change
    // and we don't want to send it to the server
    if (file && typeof file !== "string") {
      form.append("file", file);
    }
    resolve(form);
  });
