import { useMutation, useQueryClient } from 'react-query';
import { updateFilmFrontpage } from '../../modules/frontpage/frontpageApi';
import {
  FilmFrontpageApiType,
  FilmFrontpagePostPatchType,
} from '../../modules/frontpage/frontpageApiInterfaces';
import { FILM_FRONTPAGE_QUERY } from '../../queryKeys';

export const useUpdateFilmFrontpageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<FilmFrontpageApiType, unknown, FilmFrontpagePostPatchType>(
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
