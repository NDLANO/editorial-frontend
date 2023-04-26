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
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import { useSearch } from '../../../../modules/search/searchQueries';
import { useSession } from '../../../Session/SessionProvider';
import { DropdownWrapper } from '../../styles';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { useSearchNodes } from '../../../../modules/nodes/nodeQueries';

interface Props {
  filterSubject: SingleValue | undefined;
  setFilterSubject: (fs: SingleValue) => void;
}

const SubjectDropdown = ({ filterSubject, setFilterSubject }: Props) => {
  const { t, i18n } = useTranslation();
  const { ndlaId } = useSession();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { data, isInitialLoading } = useSearch({
    'responsible-ids': ndlaId,
    'aggregate-paths': 'contexts.subjectId',
  });

  const subjectIds = uniq(data?.results.map((r) => r.contexts.map((c) => c.subjectId)).flat());

  const { data: subjects } = useSearchNodes(
    {
      ids: subjectIds,
      taxonomyVersion,
      nodeType: 'SUBJECT',
      pageSize: subjectIds.length,
      language: i18n.language,
    },
    {
      select: (res) => ({
        ...res,
        results: sortBy(res.results, (r) => r.metadata.customFields.subjectCategory === 'archive'),
      }),
      enabled: !!data?.results?.length,
    },
  );
  const subjectContexts = useMemo(() => {
    if (subjects?.results.length) {
      return subjects!.results.map((r) => ({ value: r.id, label: r.name }));
    } else return [];
  }, [subjects]);

  return (
    <DropdownWrapper>
      <Select<false>
        label={t('welcomePage.chooseSubject')}
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
  );
};

export default SubjectDropdown;
