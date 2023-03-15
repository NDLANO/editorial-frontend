/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Calendar } from '@ndla/icons/editor';
import { Select, SingleValue } from '@ndla/select';
import { IConceptSearchResult, IConceptSummary } from '@ndla/types-concept-api';
import uniqBy from 'lodash/uniqBy';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchNodes } from '../../../../modules/nodes/nodeApi';
import formatDate from '../../../../util/formatDate';
import { toEditConcept } from '../../../../util/routeHelpers';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import {
  ControlWrapperDashboard,
  DropdownWrapper,
  StyledLink,
  StyledTopRowDashboardInfo,
} from '../../styles';
import GoToSearch from '../GoToSearch';
import TableComponent, { FieldElement, TitleElement } from '../TableComponent';
import TableTitle from '../TableTitle';

interface Props {
  data?: IConceptSearchResult;
  filterSubject?: SingleValue;
  isLoading: boolean;
  setSortOption: (o: string) => void;
  sortOption: string;
  error: string | undefined;
  setFilterSubject: (fs: SingleValue) => void;
  ndlaId?: string;
}

interface Concept {
  id: number;
  title: string;
  status: string;
  lastUpdated: string;
  subjects: { value: string; label: string }[];
}

const fetchConceptData = async (concept: IConceptSummary, taxonomyVersion: string) => {
  const subjects = concept.subjectIds
    ? await searchNodes({ ids: concept.subjectIds, taxonomyVersion, nodeType: 'SUBJECT' })
    : undefined;
  return {
    id: concept.id,
    title: concept.title?.title,
    status: concept.status?.current,
    lastUpdated: concept.responsible ? formatDate(concept.responsible.lastUpdated) : '',
    subjects: subjects?.results.map(subject => ({ value: subject.id, label: subject.name })) ?? [],
  };
};

const ConceptListTabContent = ({
  data,
  filterSubject,
  isLoading,
  setSortOption,
  sortOption,
  error,
  setFilterSubject,
  ndlaId,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const [conceptData, setConceptData] = useState<Concept[]>([]);

  useEffect(() => {
    (async () => {
      if (!data?.results) return;
      const _data = await Promise.all(data.results.map(c => fetchConceptData(c, taxonomyVersion)));
      setConceptData(_data);
    })();
  }, [data?.results, taxonomyVersion]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      conceptData.map(res => [
        {
          id: `title_${res.id}`,
          data: <StyledLink to={toEditConcept(res.id)}>{res.title}</StyledLink>,
        },
        {
          id: `status_${res.id}`,
          data: res.status ? t(`form.status.${res.status.toLowerCase()}`) : '',
        },
        {
          id: `concept_subject_${res.id}`,
          data: res.subjects.map(s => s.label).join(' - '),
        },
        {
          id: `date_${res.id}`,
          data: res.lastUpdated,
        },
      ]),
    [conceptData, t],
  );

  const subjectList = useMemo(() => uniqBy(conceptData.map(c => c.subjects).flat(), c => c.value), [
    conceptData,
  ]);

  const tableTitles: TitleElement[] = [
    { title: t('welcomePage.workList.name'), sortableField: 'title' },
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.workList.conceptSubject') },
    { title: t('welcomePage.workList.date'), sortableField: 'responsibleLastUpdated' },
  ];

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t('welcomePage.workList.title')}
          description={t('welcomePage.workList.conceptDescription')}
          Icon={Calendar}
        />
        <ControlWrapperDashboard>
          <DropdownWrapper>
            <Select<false>
              options={subjectList}
              placeholder={t('welcomePage.chooseSubject')}
              value={filterSubject}
              onChange={setFilterSubject}
              menuPlacement="bottom"
              small
              outline
              isLoading={isLoading}
              isSearchable
              noOptionsMessage={() => t('form.responsible.noResults')}
              isClearable
            />
          </DropdownWrapper>
          <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject} searchEnv={'concept'} />
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t('welcomePage.emptyConcepts')}
      />
    </>
  );
};

export default ConceptListTabContent;
