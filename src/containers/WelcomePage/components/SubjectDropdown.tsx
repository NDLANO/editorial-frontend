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
import { Option, Select, SingleValue } from '@ndla/select';
import styled from '@emotion/styled';
import { useSearch } from '../../../modules/search/searchQueries';
import { fetchSubject } from '../../../modules/taxonomy';
import { useSession } from '../../Session/SessionProvider';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { fetchUserData } from '../../../modules/draft/draftApi';

const Wrapper = styled.div`
  width: 200px;
`;

interface Props {
  filterSubject: SingleValue | undefined;
  setFilterSubject: (fs: SingleValue) => void;
}

const SubjectDropdown = ({ filterSubject, setFilterSubject }: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { data, isInitialLoading } = useSearch({
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
    <Wrapper>
      <Select<false>
        options={subjectList}
        placeholder={t('welcomePage.chooseSubject')}
        value={filterSubject}
        onChange={setFilterSubject}
        menuPlacement="bottom"
        small
        outline
        postfix={t('subjectsPage.subjects').toLowerCase()}
        isLoading={isInitialLoading}
        isSearchable
        noOptionsMessage={() => t('form.responsible.noResults')}
        isClearable
      />
    </Wrapper>
  );
};

export default SubjectDropdown;
