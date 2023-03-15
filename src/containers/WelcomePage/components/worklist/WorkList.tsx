/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { SingleValue, Option } from '@ndla/select';
import { TabsV2 } from '@ndla/tabs';
import { IUserData } from '@ndla/types-draft-api';
import { useSearch } from '../../../../modules/search/searchQueries';
import WorkListTabContent from './WorkListTabContent';
import { useSearchConcepts } from '../../../../modules/concept/conceptQueries';
import ConceptListTabContent from './ConceptListTabContent';
import { fetchSubject } from '../../../../modules/taxonomy';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  ndlaId: string;
  userData?: IUserData;
}

const WorkList = ({ ndlaId, userData }: Props) => {
  const [favoriteSubjects, setFavoriteSubjects] = useState<Option[]>([]);

  const [sortOption, setSortOption] = useState<string>('-responsibleLastUpdated');
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [sortOptionConcepts, setSortOptionConcepts] = useState('-responsibleLastUpdated');
  const [filterConceptSubject, setFilterConceptSubject] = useState<SingleValue | undefined>(
    undefined,
  );
  const [errorConceptList, setErrorConceptList] = useState<string | undefined>(undefined);
  const [pageConcept, setPageConcept] = useState(1);

  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { data, isInitialLoading } = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption ? sortOption : '-responsibleLastUpdated',
      ...(filterSubject ? { subjects: filterSubject.value } : {}),
      page: page,
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
    },
    {
      enabled: !!ndlaId,
      onError: () => setErrorConceptList(t('welcomePage.errorMessage')),
      onSuccess: () => setErrorConceptList(undefined),
    },
  );

  useEffect(() => {
    (async () => {
      const favoriteSubjects =
        (await Promise.all(
          userData?.favoriteSubjects?.map(id => fetchSubject({ id, taxonomyVersion })) ?? [],
        )) ?? [];
      setFavoriteSubjects(favoriteSubjects.map(fs => ({ value: fs.id, label: fs.name })));
    })();
  }, [taxonomyVersion, userData?.favoriteSubjects]);

  useEffect(() => {
    setPage(1);
  }, [filterSubject]);

  useEffect(() => {
    setPageConcept(1);
  }, [filterConceptSubject]);

  return (
    <TabsV2
      ariaLabel={t('welcomePage.workList.ariaLabel')}
      tabs={[
        {
          title: `${t('form.articleSection')} (${data?.totalCount ?? 0})`,
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
              favoriteSubjects={favoriteSubjects}
              setPage={setPage}
            />
          ),
        },
        {
          title: `${t('form.name.concepts')} (${concepts?.totalCount ?? 0})`,
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
              favoriteSubjects={favoriteSubjects}
              setPageConcept={setPageConcept}
            />
          ),
        },
      ]}
    />
  );
};

export default WorkList;
