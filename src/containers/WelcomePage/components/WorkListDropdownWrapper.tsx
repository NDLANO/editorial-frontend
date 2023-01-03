/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import uniq from 'lodash/uniq';
import { Option } from '@ndla/select';
import { useSearch } from '../../../modules/search/searchQueries';
import { fetchSubject } from '../../../modules/taxonomy';
import { useSession } from '../../Session/SessionProvider';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import DropdownPicker from './DropdownPicker';
import { fetchUserData } from '../../../modules/draft/draftApi';

interface Props {
  filterSubject: Option[] | undefined;
  setFilterSubject: (fs: Option[]) => void;
}

const WorkListDropdownWrapper = ({ filterSubject, setFilterSubject }: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { data } = useSearch({
    'responsible-ids': ndlaId,
    'aggregate-paths': 'contexts.subjectId',
  });

  const [subjectList, setSubjectList] = useState<Option[]>([]);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
  };
  useEffect(() => {
    fetchFavoriteSubjects();
  }, []);

  useEffect(() => {
    if (data) {
      // Responsible subject ids and favorite subject ids in one array, remove duplicates.
      const subjectIds = uniq([
        ...data.aggregations[0].values.map(value => value.value),
        ...favoriteSubjectIds,
      ]);

      const updateSubjectList = async () => {
        const subjects = await Promise.all(
          subjectIds.map(id => fetchSubject({ id, taxonomyVersion })) ?? [],
        );

        const subjectsResult = subjects.map(subject => ({
          value: subject.id,
          label: subject.name,
        }));
        setSubjectList(subjectsResult);
      };
      updateSubjectList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <DropdownPicker
      placeholder={t('welcomePage.chooseSubject')}
      options={subjectList}
      value={filterSubject}
      onChange={setFilterSubject}
    />
  );
};

export default WorkListDropdownWrapper;
