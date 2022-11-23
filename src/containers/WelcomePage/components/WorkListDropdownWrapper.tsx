/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../modules/search/searchQueries';
import { fetchSubject } from '../../../modules/taxonomy';
import { useSession } from '../../Session/SessionProvider';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import DropdownPicker from './DropdownPicker';

const StyledDropdownWrapper = styled.div`
  display: flex;
  gap: ${spacing.nsmall};
`;

const WorkListDropdownWrapper = () => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { data } = useSearch({
    'responsible-ids': ndlaId,
    'aggregate-paths': 'contexts.subjectId',
  });

  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>();

  useEffect(() => {
    if (data) {
      const subjectIds = data.aggregations[0].values.map(value => value.value);

      const updateSubjectList = async () => {
        const subjects = await Promise.all(
          subjectIds?.map(id => fetchSubject({ id, taxonomyVersion })) ?? [],
        );

        const filterName = subjects.map(subject => subject.name);
        setSubjectList(filterName);
      };
      updateSubjectList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <StyledDropdownWrapper>
      <DropdownPicker
        placeholder={t('welcomePage.chooseSubject')}
        valueList={subjectList}
        stateValue={filterSubject}
        updateValue={setFilterSubject}
      />
      <DropdownPicker
        placeholder={t('welcomePage.chooseTopic')}
        valueList={['English as a world language', 'Current Issues', 'Working with grammar 1']}
        stateValue={filterSubject}
        updateValue={() => console.log('Update ')}
      />
    </StyledDropdownWrapper>
  );
};

export default WorkListDropdownWrapper;
