/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SingleValue } from '@ndla/select';
import Tabs from '@ndla/tabs';
import ConceptListTabContent from './ConceptListTabContent';
import WorkListTabContent from './WorkListTabContent';
import {
  STORED_PAGE_SIZE,
  STORED_PAGE_SIZE_CONCEPT,
  STORED_PAGE_SIZE_ON_HOLD,
  STORED_SORT_OPTION_WORKLIST,
  STORED_SORT_OPTION_WORKLIST_CONCEPT,
  STORED_SORT_OPTION_WORKLIST_ON_HOLD,
} from '../../../../constants';
import { useSearchConcepts } from '../../../../modules/concept/conceptQueries';
import { useSearch } from '../../../../modules/search/searchQueries';
import { Prefix } from '../TableComponent';

interface Props {
  ndlaId: string;
}

export type SortOption = 'title' | 'responsibleLastUpdated' | 'status';
export const defaultPageSize = { label: '6', value: '6' };

const WorkList = ({ ndlaId }: Props) => {
  const storedPageSize = localStorage.getItem(STORED_PAGE_SIZE);
  const [sortOption, _setSortOption] = useState<Prefix<'-', SortOption>>(
    (localStorage.getItem(STORED_SORT_OPTION_WORKLIST) as SortOption) || '-responsibleLastUpdated',
  );
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, _setPageSize] = useState<SingleValue>(
    storedPageSize
      ? {
          label: storedPageSize,
          value: storedPageSize,
        }
      : defaultPageSize,
  );

  const storedPageSizeConcept = localStorage.getItem(STORED_PAGE_SIZE_CONCEPT);
  const [sortOptionConcepts, _setSortOptionConcepts] = useState<Prefix<'-', SortOption>>(
    (localStorage.getItem(STORED_SORT_OPTION_WORKLIST_CONCEPT) as SortOption) ||
      '-responsibleLastUpdated',
  );
  const [filterConceptSubject, setFilterConceptSubject] = useState<SingleValue | undefined>(
    undefined,
  );
  const [pageConcept, setPageConcept] = useState(1);
  const [pageSizeConcept, _setPageSizeConcept] = useState<SingleValue>(
    storedPageSizeConcept
      ? {
          label: storedPageSizeConcept,
          value: storedPageSizeConcept,
        }
      : defaultPageSize,
  );
  const [prioritized, setPrioritized] = useState(false);

  const storedPageSizeOnHold = localStorage.getItem(STORED_SORT_OPTION_WORKLIST_ON_HOLD);
  const [pageOnHold, setPageOnHold] = useState(1);
  const [sortOptionOnHold, _setSortOptionOnHold] = useState<Prefix<'-', SortOption>>(
    (localStorage.getItem(STORED_SORT_OPTION_WORKLIST_ON_HOLD) as SortOption) ||
      '-responsibleLastUpdated',
  );
  const [pageSizeOnHold, _setPageSizeOnHold] = useState<SingleValue>(
    storedPageSizeOnHold
      ? {
          label: storedPageSizeOnHold,
          value: storedPageSizeOnHold,
        }
      : defaultPageSize,
  );

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const searchQuery = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption,
      ...(prioritized ? { priority: 'prioritized' } : { priority: 'prioritized,unspecified' }),
      ...(filterSubject ? { subjects: filterSubject.value } : {}),
      page: page,
      'page-size': Number(pageSize!.value),
      language,
      fallback: true,
      'aggregate-paths': 'contexts.rootId',
    },
    { enabled: !!ndlaId },
  );

  const searchConceptsQuery = useSearchConcepts(
    {
      'responsible-ids': ndlaId,
      sort: sortOptionConcepts,
      ...(filterConceptSubject ? { subjects: filterConceptSubject.value } : {}),
      page: pageConcept,
      'page-size': Number(pageSizeConcept!.value),
      language,
      fallback: true,
    },
    { enabled: !!ndlaId },
  );

  const searchOnHoldQuery = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOptionOnHold,
      priority: 'on-hold',
      page: pageOnHold,
      'page-size': Number(pageSizeOnHold!.value),
      language,
      fallback: true,
    },
    { enabled: !!ndlaId },
  );

  const searchError = useMemo(() => {
    if (searchQuery.isError) {
      return t('welcomePage.errorMessage');
    }
  }, [searchQuery.isError, t]);

  const searchConceptsError = useMemo(() => {
    if (searchConceptsQuery.isError) {
      return t('welcomePage.errorMessage');
    }
  }, [searchConceptsQuery.isError, t]);

  const searchOnHoldError = useMemo(() => {
    if (searchOnHoldQuery.isError) {
      return t('welcomePage.errorMessage');
    }
  }, [searchOnHoldQuery.isError, t]);

  useEffect(() => {
    setPage(1);
  }, [filterSubject]);

  useEffect(() => {
    setPageConcept(1);
  }, [filterConceptSubject]);

  const setPageSize = useCallback((p: SingleValue) => {
    if (!p) return;
    _setPageSize(p);
    localStorage.setItem(STORED_PAGE_SIZE, p.value);
  }, []);

  const setPageSizeConcept = useCallback((p: SingleValue) => {
    if (!p) return;
    _setPageSizeConcept(p);
    localStorage.setItem(STORED_PAGE_SIZE_CONCEPT, p.value);
  }, []);

  const setPageSizeOnHold = useCallback((p: SingleValue) => {
    if (!p) return;
    _setPageSizeOnHold(p);
    localStorage.setItem(STORED_PAGE_SIZE_ON_HOLD, p.value);
  }, []);

  const setSortOption = useCallback((s: Prefix<'-', SortOption>) => {
    _setSortOption(s);
    localStorage.setItem(STORED_SORT_OPTION_WORKLIST, s);
  }, []);

  const setSortOptionConcepts = useCallback((s: Prefix<'-', SortOption>) => {
    _setSortOptionConcepts(s);
    localStorage.setItem(STORED_SORT_OPTION_WORKLIST_CONCEPT, s);
  }, []);

  const setSortOptionOnHold = useCallback((s: Prefix<'-', SortOption>) => {
    _setSortOptionOnHold(s);
    localStorage.setItem(STORED_SORT_OPTION_WORKLIST_ON_HOLD, s);
  }, []);

  return (
    <Tabs
      variant="rounded"
      aria-label={t('welcomePage.workList.ariaLabel')}
      tabs={[
        {
          title: `${t('taxonomy.resources')} (${searchQuery.data?.totalCount ?? 0})`,
          id: 'articles',
          content: (
            <WorkListTabContent
              data={searchQuery.data}
              filterSubject={filterSubject}
              setSortOption={setSortOption}
              setFilterSubject={setFilterSubject}
              isLoading={searchQuery.isLoading}
              error={searchError}
              sortOption={sortOption}
              ndlaId={ndlaId}
              setPage={setPage}
              setPrioritized={setPrioritized}
              prioritized={prioritized}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          ),
        },
        {
          title: `${t('welcomePage.workList.onHold')} (${searchOnHoldQuery.data?.totalCount ?? 0})`,
          id: 'onHold',
          content: (
            <WorkListTabContent
              data={searchOnHoldQuery.data}
              setSortOption={setSortOptionOnHold}
              isLoading={searchOnHoldQuery.isLoading}
              error={searchOnHoldError}
              sortOption={sortOptionOnHold}
              ndlaId={ndlaId}
              setPage={setPageOnHold}
              pageSize={pageSizeOnHold}
              setPageSize={setPageSizeOnHold}
              headerText="welcomePage.workList.onHoldHeading"
              descriptionText="welcomePage.workList.onHoldDescription"
            />
          ),
        },
        {
          title: `${t('form.name.concepts')} (${searchConceptsQuery.data?.totalCount ?? 0})`,
          id: 'concepts',
          content: (
            <ConceptListTabContent
              data={searchConceptsQuery.data}
              setSortOption={setSortOptionConcepts}
              isLoading={searchConceptsQuery.isLoading}
              error={searchConceptsError}
              sortOption={sortOptionConcepts}
              filterSubject={filterConceptSubject}
              setFilterSubject={setFilterConceptSubject}
              ndlaId={ndlaId}
              setPageConcept={setPageConcept}
              pageSizeConcept={pageSizeConcept}
              setPageSizeConcept={setPageSizeConcept}
            />
          ),
        },
      ]}
    />
  );
};

export default WorkList;
