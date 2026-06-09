/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NewOrUpdatedFilmFrontPageDTO } from "@ndla/types-backend/frontpage-api";
import { mutationOptions } from "@tanstack/react-query";
import { filmQueryKeys } from "./filmQueryKeys";
import { updateFilmFrontpage } from "./frontpageApi";

export const updateFilmFriltnpageMutationOptions = () => {
  return mutationOptions({
    mutationFn: (data: NewOrUpdatedFilmFrontPageDTO) => updateFilmFrontpage(data),
    onSettled: (_, __, ___, ____, ctx) => ctx.client.invalidateQueries({ queryKey: filmQueryKeys.filmFrontpage }),
  });
};
