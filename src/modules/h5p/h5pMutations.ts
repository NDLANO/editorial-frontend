/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { copyH5P, H5pCopyResponse } from "../../components/H5PElement/h5pApi";

export const useCopyH5pMutation = (options?: Partial<UseMutationOptions<H5pCopyResponse, unknown, string>>) => {
  return useMutation<H5pCopyResponse, undefined, string>({
    mutationFn: (url) => copyH5P(url),
    ...options,
  });
};
