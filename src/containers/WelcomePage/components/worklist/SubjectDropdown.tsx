/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, Select, SingleValue } from '@ndla/select';
import { useSearch } from '../../../../modules/search/searchQueries';
import { useSession } from '../../../Session/SessionProvider';
import { DropdownWrapper } from '../../styles';

interface Props {
  filterSubject: SingleValue | undefined;
  setFilterSubject: (fs: SingleValue) => void;
  favoriteSubjects: Option[];
}

const SubjectDropdown = ({ filterSubject, setFilterSubject, favoriteSubjects }: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();

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

  return (
    <DropdownWrapper>
      <Select<false>
        options={subjectContexts.concat(favoriteSubjects)}
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