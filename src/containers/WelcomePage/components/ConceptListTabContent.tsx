/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Calendar } from '@ndla/icons/editor';
import { IConceptSearchResult } from '@ndla/types-concept-api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSubject } from '../../../modules/taxonomy';
import { toEditConcept } from '../../../util/routeHelpers';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { StyledLink, StyledTopRowDashboardInfo } from '../styles';
import TableComponent, { FieldElement, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';

interface Props {
  data: IConceptSearchResult | undefined;
  //filterSubjects: MultiValue | undefined;
  isLoading: boolean;
  setSortOption: (o: string) => void;
  sortOption: string;
  error: string | undefined;
}

interface Concept {
  id: number;
  title: string;
  status: string;
  subjects: { id: string; title: string }[];
}

const ConceptListTabContent = ({ data, isLoading, setSortOption, sortOption, error }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const [conceptData, setConceptData] = useState<Concept[]>([]);

  useEffect(() => {
    const updateConceptData = async () => {
      const _conceptData = await Promise.all(
        (data?.results ?? []).map(async concept => {
          console.log('concept', concept);
          const subjects = await Promise.all(
            (concept.subjectIds ?? []).map(id => fetchSubject({ id, taxonomyVersion })),
          );
          return {
            id: concept.id,
            title: concept.title?.title,
            status: concept.status?.current,
            subjects: subjects.map(subject => ({ id: subject.id, title: subject.name })),
          };
        }),
      );
      setConceptData(_conceptData);
    };
    updateConceptData();
  }, [data?.results, taxonomyVersion]);

  const tableData: FieldElement[][] = conceptData.length
    ? conceptData.map(res => [
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
          data: res.subjects.map(s => s.title).join(' - '),
        },
      ])
    : [[]];

  const tableTitles: TitleElement[] = [
    { title: t('welcomePage.workList.name'), sortableField: 'title' },
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.workList.conceptSubject') },
  ];

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t('form.name.concepts')}
          description={t('welcomePage.workList.conceptDescription')}
          Icon={Calendar}
        />
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t('form.responsible.noArticles')}
      />
    </>
  );
};

export default ConceptListTabContent;
