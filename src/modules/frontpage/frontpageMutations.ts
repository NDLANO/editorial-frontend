/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mutationOptions } from "@tanstack/react-query";
import { postFrontpage } from "./frontpageApi";
import { frontpageQueryKeys } from "./frontpageQueries";

export const updateFrontpageMutationOptions = () => {
  return mutationOptions({
    mutationFn: postFrontpage,
    onSettled: (_, __, ___, ____, ctx) => ctx.client.invalidateQueries({ queryKey: frontpageQueryKeys.frontpage }),
  });
};
