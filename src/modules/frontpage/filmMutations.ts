/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IFilmFrontPageDTO, INewOrUpdatedFilmFrontPageDTO } from "@ndla/types-backend/frontpage-api";
import { updateFilmFrontpage } from "./frontpageApi";
import { filmQueryKeys } from "./filmQueryKeys";

export const useUpdateFilmFrontpageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IFilmFrontPageDTO, unknown, INewOrUpdatedFilmFrontPageDTO>({
    mutationFn: (data) => updateFilmFrontpage(data),
    onError: (_, __, previousFrontpage) => {
      if (previousFrontpage) {
        queryClient.setQueryData(filmQueryKeys.filmFrontpage, previousFrontpage);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: filmQueryKeys.filmFrontpage }),
  });
};
