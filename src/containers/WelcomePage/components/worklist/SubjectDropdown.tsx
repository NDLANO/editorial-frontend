/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from 'lodash/sortBy';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SingleValue } from '@ndla/select';
import { SUBJECT_NODE } from '../../../../modules/nodes/nodeApiTypes';
import { useSearchNodes } from '../../../../modules/nodes/nodeQueries';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { DropdownWrapper } from '../../styles';

interface Props {
  subjectIds: string[];
  filterSubject: SingleValue | undefined;
  setFilterSubject: (fs: SingleValue) => void;
  removeArchived?: boolean;
  placeholder?: string;
}

const SubjectDropdown = ({
  subjectIds,
  filterSubject,
  setFilterSubject,
  removeArchived = false,
  placeholder,
}: Props) => {
  const [enableSearch, setEnableSearch] = useState(false);
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { data: subjects, isLoading } = useSearchNodes(
    {
      ids: subjectIds,
      taxonomyVersion,
      nodeType: SUBJECT_NODE,
      pageSize: subjectIds.length,
      language: i18n.language,
    },
    {
      select: (res) => ({
        ...res,
        results: sortBy(res.results, (r) => r.name),
      }),
      enabled: !!subjectIds.length && enableSearch,
    },
  );
  const subjectContexts = useMemo(() => {
    if (subjects?.results.length) {
      let updatedArchived;
      if (removeArchived) {
        updatedArchived = subjects.results.filter(
          (s) => s.metadata.customFields.subjectCategory !== 'archive',
        );
      } else {
        updatedArchived = sortBy(
          subjects.results,
          (r) => r.metadata.customFields.subjectCategory === 'archive',
        );
      }
      return updatedArchived.map((r) => ({ value: r.id, label: r.name }));
    } else return [];
  }, [removeArchived, subjects]);

  return (
    <DropdownWrapper>
      <Select<false>
        aria-label={placeholder ?? t('welcomePage.chooseSubject')}
        options={subjectContexts}
        placeholder={placeholder ?? t('welcomePage.chooseSubject')}
        value={filterSubject}
        onChange={setFilterSubject}
        menuPlacement="bottom"
        small
        outline
        isSearchable
        noOptionsMessage={() => t('form.responsible.noResults')}
        loadingMessage={() => t('welcomePage.workList.loading')}
        isClearable
        onFocus={() => {
          if (!enableSearch) setEnableSearch(true);
        }}
        isLoading={isLoading}
      />
    </DropdownWrapper>
  );
};

export default SubjectDropdown;
