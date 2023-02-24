/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SingleValue } from '@ndla/select';
import { TabsV2 } from '@ndla/tabs';
import { useSearch } from '../../../../modules/search/searchQueries';
import WorkListTabContent from './WorkListTabContent';
import { useSearchConcepts } from '../../../../modules/concept/conceptQueries';
import ConceptListTabContent from './ConceptListTabContent';

interface Props {
  ndlaId: string;
}

const WorkList = ({ ndlaId }: Props) => {
  const [sortOption, setSortOption] = useState<string>('-responsibleLastUpdated');
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const [sortOptionConcepts, setSortOptionConcepts] = useState('-responsibleLastUpdated');
  const [filterConceptSubject, setFilterConceptSubject] = useState<SingleValue | undefined>(
    undefined,
  );
  const [errorConceptList, setErrorConceptList] = useState<string | undefined>(undefined);

  const { t } = useTranslation();
  const { data, isInitialLoading } = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption ? sortOption : '-responsibleLastUpdated',
      ...(filterSubject ? { subjects: filterSubject.value } : {}),
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
    },
    {
      enabled: !!ndlaId,
      onError: () => setErrorConceptList(t('welcomePage.errorMessage')),
      onSuccess: () => setErrorConceptList(undefined),
    },
  );

  return (
    <TabsV2
      ariaLabel={t('welcomePage.workList.ariaLabel')}
      tabs={[
        {
          title: `${t('welcomePage.workList.title')} (${data?.results.length ?? 0})`,
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
            />
          ),
        },
        {
          title: `${t('form.name.concepts')} (${concepts?.results.length ?? 0})`,
          content: (
            <ConceptListTabContent
              data={concepts}
              setSortOption={setSortOptionConcepts}
              isLoading={conceptsLoading}
              error={errorConceptList}
              sortOption={sortOptionConcepts}
              filterSubject={filterConceptSubject}
              setFilterSubject={setFilterConceptSubject}
            />
          ),
        },
      ]}
    />
  );
};

export default WorkList;
