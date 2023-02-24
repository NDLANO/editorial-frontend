/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, Select, SingleValue } from '@ndla/select';
import styled from '@emotion/styled';
import uniqBy from 'lodash/uniqBy';
import { useSearch } from '../../../../modules/search/searchQueries';
import { fetchSubject } from '../../../../modules/taxonomy';
import { useSession } from '../../../Session/SessionProvider';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { fetchUserData } from '../../../../modules/draft/draftApi';
import { DropdownWrapper } from '../../styles';

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

  const subjectContexts = useMemo(() => {
    if (data?.results.length) {
      return data.results
        .map(r => r.contexts.map(c => ({ value: c.subjectId, label: c.subject })))
        .flat();
    } else return [];
  }, [data?.results]);

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
      const updateSubjectList = async () => {
        const subjects = await Promise.all(
          favoriteSubjectIds.map(id => fetchSubject({ id, taxonomyVersion })) ?? [],
        );

        const subjectsResult = uniqBy(
          subjects
            .map(s => ({
              value: s.id,
              label: s.name,
            }))
            .concat(subjectContexts),
          s => s.value,
        );
        setSubjectList(subjectsResult);
      };
      updateSubjectList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <DropdownWrapper>
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
    </DropdownWrapper>
  );
};

export default SubjectDropdown;
