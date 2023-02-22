/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { MultiValue } from '@ndla/select';
import { TabsV2 } from '@ndla/tabs';
import { useSearch } from '../../../modules/search/searchQueries';
import WorkListTabContent from './WorkListTabContent';
import { useSearchConcepts } from '../../../modules/concept/conceptQueries';
import ConceptListTabContent from './ConceptListTabContent';

interface Props {
  ndlaId: string;
}

const WorkList = ({ ndlaId }: Props) => {
  const [sortOption, setSortOption] = useState('-responsibleLastUpdated');
  const [sortOptionConcepts, setSortOptionConcepts] = useState('-title');
  const [error, setError] = useState<string>();
  const [errorConceptList, setErrorConceptList] = useState<string>();

  const [filterSubjects, setFilterSubject] = useState<MultiValue>([]);

  const updateSortOption = useCallback((v: string) => setSortOption(v), []);
  const updateSortOptionConcepts = useCallback((v: string) => setSortOptionConcepts(v), []);

  const updateFilterSubjects = useCallback((o: MultiValue) => setFilterSubject(o), []);

  const { data, isLoading } = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption,
      ...(filterSubjects.length ? { subjects: filterSubjects.map(fs => fs.value).join(',') } : {}),
    },
    {
      enabled: !!ndlaId,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  const { data: concepts, isLoading: conceptsLoading } = useSearchConcepts(
    {
      'responsible-ids': ndlaId,
      sort: sortOptionConcepts,
    },
    {
      enabled: !!ndlaId,
      onError: () => setErrorConceptList(t('welcomePage.errorMessage')),
      onSuccess: () => setErrorConceptList(undefined),
    },
  );

  const { t } = useTranslation();
  console.log(data);
  return (
    <TabsV2
      ariaLabel={t('welcomePage.workList.ariaLabel')}
      tabs={[
        {
          title: `${t('welcomePage.workList.title')} (${data?.results.length ?? 0})`,
          content: (
            <WorkListTabContent
              data={data}
              filterSubjects={filterSubjects}
              setSortOption={updateSortOption}
              setFilterSubject={updateFilterSubjects}
              isLoading={isLoading}
              error={error}
              sortOption={sortOption}
            />
          ),
        },
        {
          title: `${t('form.name.concepts')} (${concepts?.results.length ?? 0})`,
          content: (
            <ConceptListTabContent
              data={concepts}
              setSortOption={updateSortOptionConcepts}
              isLoading={conceptsLoading}
              error={errorConceptList}
              sortOption={sortOptionConcepts}
            />
          ),
        },
      ]}
    />
  );
};

export default WorkList;
