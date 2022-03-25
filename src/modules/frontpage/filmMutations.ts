/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQueryClient } from 'react-query';
import { IFilmFrontPageData, INewOrUpdatedFilmFrontPageData } from '@ndla/types-frontpage-api';
import { updateFilmFrontpage } from './frontpageApi';
import { FILM_FRONTPAGE_QUERY } from '../../queryKeys';

export const useUpdateFilmFrontpageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IFilmFrontPageData, unknown, INewOrUpdatedFilmFrontPageData>(
    data => {
      return updateFilmFrontpage(data);
    },
    {
      onError: (_, __, previousFrontpage) => {
        if (previousFrontpage) {
          queryClient.setQueryData(FILM_FRONTPAGE_QUERY, previousFrontpage);
        }
      },
      onSettled: () => queryClient.invalidateQueries(FILM_FRONTPAGE_QUERY),
    },
  );
};
