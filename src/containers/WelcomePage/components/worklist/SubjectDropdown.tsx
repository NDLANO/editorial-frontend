/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SingleValue } from '@ndla/select';
import uniqBy from 'lodash/uniqBy';
import Tooltip from '@ndla/tooltip';
import { useSearch } from '../../../../modules/search/searchQueries';
import { useSession } from '../../../Session/SessionProvider';
import { DropdownWrapper } from '../../styles';

interface Props {
  filterSubject: SingleValue | undefined;
  setFilterSubject: (fs: SingleValue) => void;
}

const SubjectDropdown = ({ filterSubject, setFilterSubject }: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();

  const { data, isInitialLoading } = useSearch({
    'responsible-ids': ndlaId,
    'aggregate-paths': 'contexts.subjectId',
  });

  const subjectContexts = useMemo(() => {
    if (data?.results.length) {
      return uniqBy(
        data.results
          .map((r) => r.contexts.map((c) => ({ value: c.subjectId, label: c.subject })))
          .flat(),
        (r) => r.value,
      );
    } else return [];
  }, [data?.results]);

  return (
    <Tooltip tooltip={filterSubject ? filterSubject.label : t('welcomePage.chooseSubject')}>
      <DropdownWrapper>
        <Select<false>
          options={subjectContexts}
          placeholder={t('welcomePage.chooseSubject')}
          value={filterSubject}
          onChange={setFilterSubject}
          menuPlacement="bottom"
          small
          outline
          isLoading={isInitialLoading}
          isSearchable
          noOptionsMessage={() => t('form.responsible.noResults')}
          isClearable
        />
      </DropdownWrapper>
    </Tooltip>
  );
};

export default SubjectDropdown;
