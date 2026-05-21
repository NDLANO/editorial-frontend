/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mutationOptions } from "@tanstack/react-query";
import { cloneImage } from "./imageApi";

interface CloneImageInput {
  imageId: number;
  imageFile: Blob;
}

export const cloneImageMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: CloneImageInput) => cloneImage(vars.imageId, vars.imageFile),
  });
};
