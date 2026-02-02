/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { cloneImage } from "./imageApi";

interface CloneImageInput {
  imageId: number;
  imageFile: Blob;
}

export const useCloneImageMutation = (
  options?: Partial<UseMutationOptions<ImageMetaInformationV3DTO, unknown, CloneImageInput>>,
) => {
  return useMutation<ImageMetaInformationV3DTO, unknown, CloneImageInput>({
    mutationFn: (vars) => cloneImage(vars.imageId, vars.imageFile),
    ...options,
  });
};
