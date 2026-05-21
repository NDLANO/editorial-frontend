/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mutationOptions } from "@tanstack/react-query";
import { copyH5P } from "../../components/H5PElement/h5pApi";

export const copyH5pMutationOptions = () => {
  return mutationOptions({
    mutationFn: (url: string) => copyH5P(url),
  });
};
