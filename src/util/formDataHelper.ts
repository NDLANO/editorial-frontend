/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NewAudioMetaInformationDTO, UpdatedAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import { NewImageMetaInformationV2DTO, UpdateImageMetaInformationDTO } from "@ndla/types-backend/image-api";

export const createFormData = (
  file?: string | Blob,
  metadata?:
    | NewImageMetaInformationV2DTO
    | UpdateImageMetaInformationDTO
    | NewAudioMetaInformationDTO
    | UpdatedAudioMetaInformationDTO,
): FormData => {
  const form = new FormData();
  if (metadata) {
    form.append("metadata", JSON.stringify(metadata));
  }
  // If the file is a string, it is a URL to existing data, that didn't change
  // and we don't want to send it to the server
  if (file && typeof file !== "string") {
    form.append("file", file);
  }
  return form;
};
