/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { SingleValue } from '@ndla/select';
import { useCallback, useEffect, useState } from 'react';
import Tabs from '@ndla/tabs';
import { useSearch } from '../../../../modules/search/searchQueries';
import WorkListTabContent from './WorkListTabContent';
import { useSearchConcepts } from '../../../../modules/concept/conceptQueries';
import ConceptListTabContent from './ConceptListTabContent';
import { Prefix } from '../TableComponent';
import {
  STORED_SORT_OPTION_WORKLIST,
  STORED_SORT_OPTION_WORKLIST_CONCEPT,
} from '../../../../constants';

interface Props {
  ndlaId: string;
}

export type SortOption = 'title' | 'responsibleLastUpdated' | 'status';

const WorkList = ({ ndlaId }: Props) => {
  const [sortOption, _setSortOption] = useState<Prefix<'-', SortOption>>(
    (localStorage.getItem(STORED_SORT_OPTION_WORKLIST) as SortOption) || '-responsibleLastUpdated',
  );
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [sortOptionConcepts, _setSortOptionConcepts] = useState<Prefix<'-', SortOption>>(
    (localStorage.getItem(STORED_SORT_OPTION_WORKLIST_CONCEPT) as SortOption) ||
      '-responsibleLastUpdated',
  );
  const [filterConceptSubject, setFilterConceptSubject] = useState<SingleValue | undefined>(
    undefined,
  );
  const [errorConceptList, setErrorConceptList] = useState<string | undefined>(undefined);
  const [pageConcept, setPageConcept] = useState(1);
  const [prioritized, setPrioritized] = useState(false);

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { data, isInitialLoading } = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption,
      ...(prioritized ? { prioritized: true } : {}),
      ...(filterSubject ? { subjects: filterSubject.value } : {}),
      page: page,
      'page-size': 6,
      language,
      fallback: true,
      'aggregate-paths': 'contexts.rootId',
    },
    {
      enabled: !!ndlaId,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );
  const { data: concepts, isInitialLoading: conceptsLoading } = useSearchConcepts(
    {
      'responsible-ids': ndlaId,
      sort: sortOptionConcepts,
      ...(filterConceptSubject ? { subjects: filterConceptSubject.value } : {}),
      page: pageConcept,
      'page-size': 6,
      language,
      fallback: true,
    },
    {
      enabled: !!ndlaId,
      onError: () => setErrorConceptList(t('welcomePage.errorMessage')),
      onSuccess: () => setErrorConceptList(undefined),
    },
  );

  useEffect(() => {
    setPage(1);
  }, [filterSubject]);

  useEffect(() => {
    setPageConcept(1);
  }, [filterConceptSubject]);

  const setSortOption = useCallback((s: Prefix<'-', SortOption>) => {
    _setSortOption(s);
    localStorage.setItem(STORED_SORT_OPTION_WORKLIST, s);
  }, []);

  const setSortOptionConcepts = useCallback((s: Prefix<'-', SortOption>) => {
    _setSortOptionConcepts(s);
    localStorage.setItem(STORED_SORT_OPTION_WORKLIST_CONCEPT, s);
  }, []);

  return (
    <Tabs
      variant="rounded"
      aria-label={t('welcomePage.workList.ariaLabel')}
      tabs={[
        {
          title: `${t('taxonomy.resources')} (${data?.totalCount ?? 0})`,
          id: 'articles',
          content: (
            <WorkListTabContent
              data={data}
              filterSubject={filterSubject}
              setSortOption={setSortOption}
              setFilterSubject={setFilterSubject}
              isLoading={isInitialLoading}
              error={error}
              sortOption={sortOption}
              ndlaId={ndlaId}
              setPage={setPage}
              setPrioritized={setPrioritized}
              prioritized={prioritized}
            />
          ),
        },
        {
          title: `${t('form.name.concepts')} (${concepts?.totalCount ?? 0})`,
          id: 'concepts',
          content: (
            <ConceptListTabContent
              data={concepts}
              setSortOption={setSortOptionConcepts}
              isLoading={conceptsLoading}
              error={errorConceptList}
              sortOption={sortOptionConcepts}
              filterSubject={filterConceptSubject}
              setFilterSubject={setFilterConceptSubject}
              ndlaId={ndlaId}
              setPageConcept={setPageConcept}
            />
          ),
        },
      ]}
    />
  );
};

export default WorkList;
