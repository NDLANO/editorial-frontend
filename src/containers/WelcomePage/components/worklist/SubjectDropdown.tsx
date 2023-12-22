/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from 'lodash/sortBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SingleValue } from '@ndla/select';
import { useSearchNodes } from '../../../../modules/nodes/nodeQueries';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { DropdownWrapper } from '../../styles';

interface Props {
  subjectIds: string[];
  filterSubject: SingleValue | undefined;
  setFilterSubject: (fs: SingleValue) => void;
}

const SubjectDropdown = ({ subjectIds, filterSubject, setFilterSubject }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

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
        results: sortBy(res.results, (r) => r.name),
      }),
      enabled: !!subjectIds.length,
    },
  );
  const subjectContexts = useMemo(() => {
    if (subjects?.results.length) {
      const archivedAtBottom = sortBy(
        subjects.results,
        (r) => r.metadata.customFields.subjectCategory === 'archive',
      );
      return archivedAtBottom.map((r) => ({ value: r.id, label: r.name }));
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
        isSearchable
        noOptionsMessage={() => t('form.responsible.noResults')}
        isClearable
      />
    </DropdownWrapper>
  );
};

export default SubjectDropdown;
