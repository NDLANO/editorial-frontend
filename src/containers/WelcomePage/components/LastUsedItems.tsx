/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import orderBy from 'lodash/orderBy';
import Tabs from '@ndla/tabs';
import { IConceptSearchResult, IConceptSummary } from '@ndla/types-backend/concept-api';
import { IArticleSummary, ISearchResult } from '@ndla/types-backend/draft-api';
import { Prefix, TitleElement } from './TableComponent';
import { useSearchDrafts } from '../../../modules/draft/draftQueries';
import LastUsedResources from './LastUsedResources';
import LastUsedConcepts from './LastUsedConcepts';
import { useSearchConcepts } from '../../../modules/concept/conceptQueries';

export type SortOptionLastUsed = 'title' | 'lastUpdated';

const PAGE_SIZE = 6;

const getLastPage = (res?: ISearchResult | IConceptSearchResult) =>
  res?.results.length ? Math.ceil(res.results.length / PAGE_SIZE) : 1;

type SortOptionType = Prefix<'-', SortOptionLastUsed>;

const getSortedPaginationData = <T extends IConceptSummary | IArticleSummary>(
  page: number,
  sortOption: SortOptionType,
  data: T[],
): T[] => {
  const sortDesc = sortOption.charAt(0) === '-';
  // Pagination logic. startIndex indicates start position in data.results for current page
  // currentPageElements is data to be displayed at current page
  const startIndex = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  const currentPageElements = data.slice(startIndex, startIndex + PAGE_SIZE);

  return orderBy(
    currentPageElements,
    (e) =>
      sortOption.includes('title') ? e.title?.title : 'updated' in e ? e.updated : e.lastUpdated,
    [sortDesc ? 'desc' : 'asc'],
  );
};
interface Props {
  lastUsedResources?: number[];
  lastUsedConcepts?: string[];
}

const LastUsedItems = ({ lastUsedResources = [], lastUsedConcepts = [] }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const [sortOption, setSortOption] = useState<SortOptionType>('-lastUpdated');
  const [error, setError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [sortOptionConcept, setSortOptionConcept] = useState<SortOptionType>('-lastUpdated');
  const [errorConcept, setErrorConcept] = useState<string | undefined>(undefined);
  const [pageConcept, setPageConcept] = useState(1);

  const { data, isInitialLoading } = useSearchDrafts(
    {
      ids: lastUsedResources!,
      sort: '-lastUpdated',
      language,
    },
    {
      enabled: !!lastUsedResources.length,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  const { data: conceptsData, isInitialLoading: isLoadingConcepts } = useSearchConcepts(
    { ids: lastUsedConcepts.join(',')!, sort: '-lastUpdated', language },
    {
      enabled: !!lastUsedConcepts.length,
      onError: () => setErrorConcept(t('welcomePage.errorMessage')),
      onSuccess: () => setErrorConcept(undefined),
    },
  );
  const sortedData = useMemo(
    () => (data?.results ? getSortedPaginationData(page, sortOption, data.results) : []),
    [data, page, sortOption],
  );

  const sortedConceptsData = useMemo(
    () =>
      conceptsData?.results
        ? getSortedPaginationData(pageConcept, sortOptionConcept, conceptsData.results)
        : [],
    [conceptsData, pageConcept, sortOptionConcept],
  );

  const lastPage = useMemo(() => getLastPage(data), [data]);
  const lastPageConcepts = useMemo(() => getLastPage(conceptsData), [conceptsData]);

  const tableTitles: TitleElement<SortOptionLastUsed>[] = [
    { title: t('form.name.title'), sortableField: 'title' },
    { title: t('welcomePage.updated'), sortableField: 'lastUpdated', width: '40%' },
  ];

  return (
    <Tabs
      variant="rounded"
      aria-label={t('welcomePage.lastUsed')}
      tabs={[
        {
          title: `${t('taxonomy.resources')} (${data?.totalCount ?? 0})`,
          id: 'articles',
          content: (
            <LastUsedResources
              data={sortedData}
              isLoading={isInitialLoading}
              page={page}
              setPage={setPage}
              lastPage={lastPage}
              sortOption={sortOption}
              setSortOption={setSortOption}
              error={error}
              titles={tableTitles}
            />
          ),
        },
        {
          title: `${t('form.name.concepts')} (${conceptsData?.totalCount ?? 0})`,
          id: 'concepts',
          content: (
            <LastUsedConcepts
              data={sortedConceptsData}
              isLoading={isLoadingConcepts}
              page={pageConcept}
              setPage={setPageConcept}
              sortOption={sortOptionConcept}
              setSortOption={setSortOptionConcept}
              error={errorConcept}
              lastPage={lastPageConcepts}
              titles={tableTitles}
            />
          ),
        },
      ]}
    />
  );
};

export default LastUsedItems;
