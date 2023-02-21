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
interface Props {
  ndlaId: string;
}

const WorkList = ({ ndlaId }: Props) => {
  const [sortOption, setSortOption] = useState<string>('-responsibleLastUpdated');
  const [error, setError] = useState();

  const [filterSubjects, setFilterSubject] = useState<MultiValue>([]);
  const updateFilterSubjects = useCallback((o: MultiValue) => setFilterSubject(o), []);

  const { data, isLoading } = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption ? sortOption : '-responsibleLastUpdated',
      ...(filterSubjects.length ? { subjects: filterSubjects.map(fs => fs.value).join(',') } : {}),
    },
    {
      enabled: !!ndlaId,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  const updateSortOption = useCallback((v: string) => setSortOption(v), []);

  const { t } = useTranslation();

  return (
    <TabsV2
      ariaLabel="tabell hei"
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
        { title: `${t('form.name.concepts')} (0)`, content: <div>hehe</div> },
      ]}
    />
  );
};

export default WorkList;
