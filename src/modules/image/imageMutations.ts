/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { cloneImage } from "./imageApi";

interface CloneImageInput {
  imageId: number;
  imageFile: Blob;
}

export const useCloneImageMutation = (
  options?: Partial<UseMutationOptions<IImageMetaInformationV3DTO, unknown, CloneImageInput>>,
) => {
  return useMutation<IImageMetaInformationV3DTO, unknown, CloneImageInput>({
    mutationFn: (vars) => cloneImage(vars.imageId, vars.imageFile),
    ...options,
  });
};
