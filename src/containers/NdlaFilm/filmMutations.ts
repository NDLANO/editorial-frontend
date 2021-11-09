import { useMutation, useQueryClient } from 'react-query';
import { updateFilmFrontpage } from '../../modules/frontpage/frontpageApi';
import { FilmFrontpageApiType } from '../../modules/frontpage/frontpageApiInterfaces';
import { FILM_FRONTPAGE_QUERY } from '../../queryKeys';

export const useUpdateFilmFrontpageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<FilmFrontpageApiType, unknown, FilmFrontpageApiType>(
    data => {
      return updateFilmFrontpage(data);
    },
    {
      onMutate: async newFrontpage => {
        await queryClient.cancelQueries(FILM_FRONTPAGE_QUERY);
        const previousFrontpage = queryClient.getQueryData<FilmFrontpageApiType>(
          FILM_FRONTPAGE_QUERY,
        );
        queryClient.setQueryData<FilmFrontpageApiType>(FILM_FRONTPAGE_QUERY, newFrontpage);
        return previousFrontpage;
      },
      onError: (_, __, previousFrontpage) => {
        if (previousFrontpage) {
          queryClient.setQueryData(FILM_FRONTPAGE_QUERY, previousFrontpage);
        }
      },
      onSettled: () => queryClient.invalidateQueries(FILM_FRONTPAGE_QUERY),
    },
  );
};
