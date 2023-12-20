/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen } from '@ndla/icons/common';
import { SingleValue } from '@ndla/select';
import { IMultiSearchResult } from '@ndla/types-backend/search-api';
import TableComponent, { FieldElement } from './TableComponent';
import TableTitle from './TableTitle';
import SubjectDropdown from './worklist/SubjectDropdown';
import {
  ARCHIVED,
  LMA_SUBJECT_ID,
  PUBLISHED,
  STATUS_ORDER,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
  UNPUBLISHED,
} from '../../../constants';
import { useNodes } from '../../../modules/nodes/nodeQueries';
import { useSearch } from '../../../modules/search/searchQueries';
import { toSearch } from '../../../util/routeHelpers';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import {
  ControlWrapperDashboard,
  StyledDashboardInfo,
  StyledLink,
  StyledSwitch,
  StyledTopRowDashboardInfo,
  SwitchWrapper,
} from '../styles';

const EXCLUDE_STATUSES = [PUBLISHED, UNPUBLISHED, ARCHIVED];

// Function to combine results from two aggregations into one sorted result array
const getResultAggregationList = (
  searchResult: IMultiSearchResult | undefined,
  responibleSearchResult: IMultiSearchResult | undefined,
) => {
  const aggData = searchResult?.aggregations.find((a) => a.field === 'draftStatus.current');
  const aggDataExcludeStatuses =
    aggData?.values.filter((v) => !EXCLUDE_STATUSES.includes(v.value)) ?? [];

  const responsibleAggData = responibleSearchResult?.aggregations.find(
    (a) => a.field === 'draftStatus.current',
  );
  const responsibleAggDataExcludeStatuses =
    responsibleAggData?.values.filter((v) => !EXCLUDE_STATUSES.includes(v.value)) ?? [];

  const resultList = aggDataExcludeStatuses.map((aggData) => {
    const responsibleAgg = responsibleAggDataExcludeStatuses.find((r) => r.value === aggData.value);
    return { ...aggData, responsibleCount: responsibleAgg?.count ?? 0 };
  });

  return resultList.sort((a, b) => STATUS_ORDER.indexOf(a.value) - STATUS_ORDER.indexOf(b.value));
};

interface Props {
  ndlaId: string;
}

const LMASubjects = ({ ndlaId }: Props) => {
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [hideOnHold, setHideOnHold] = useState(false);
  const { i18n, t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const subjectsQuery = useNodes(
    {
      language: i18n.language,
      taxonomyVersion,
      nodeType: 'SUBJECT',
      key: TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
      value: ndlaId,
    },
    { enabled: !!ndlaId },
  );

  const userHasSubjectLMA = !!subjectsQuery.data?.length;

  const allSubjectIds = useMemo(() => subjectsQuery.data?.map((s) => s.id), [subjectsQuery.data]);
  const subjectIds: string[] | undefined = useMemo(
    () => (filterSubject ? [filterSubject.value] : allSubjectIds),
    [allSubjectIds, filterSubject],
  );

  const searchQuery = useSearch(
    {
      'page-size': 0,
      'aggregate-paths': 'draftStatus.current',
      subjects: subjectIds?.join(', '),
      ...(hideOnHold ? { priority: 'prioritized,unspecified' } : {}),
    },
    {
      enabled: userHasSubjectLMA,
    },
  );

  const searchResponsibleQuery = useSearch(
    {
      'responsible-ids': ndlaId,
      'page-size': 0,
      'aggregate-paths': 'draftStatus.current',
      subjects: subjectIds?.join(', '),
    },
    {
      enabled: userHasSubjectLMA,
    },
  );

  const error = useMemo(() => {
    if (subjectsQuery.isError || searchQuery.isError || searchResponsibleQuery.error) {
      return t('welcomePage.errorMessage');
    }
  }, [searchQuery.isError, searchResponsibleQuery.error, subjectsQuery.isError, t]);

  const tableTitles = [
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.count') },
    { title: t('welcomePage.countResponsible') },
  ];

  const tableData: FieldElement[][] = useMemo(() => {
    const resultList = getResultAggregationList(searchQuery.data, searchResponsibleQuery.data);

    return (
      resultList.map((statusData) => {
        const statusTitle = t(`form.status.actions.${statusData.value}`);
        return [
          {
            id: `status_${statusData.value}`,
            data: (
              <StyledLink
                to={toSearch(
                  {
                    page: '1',
                    sort: '-relevance',
                    'page-size': 10,
                    subjects: LMA_SUBJECT_ID,
                    'draft-status': statusData.value,
                  },
                  'content',
                )}
                title={statusTitle}
              >
                {statusTitle}
              </StyledLink>
            ),
          },
          { id: `count_${statusData.value}`, data: statusData.count },
          {
            id: `responsible_${statusData.value}`,
            data: statusData.responsibleCount,
          },
        ];
      }) ?? [[]]
    );
  }, [searchQuery.data, searchResponsibleQuery.data, t]);

  return (
    <>
      {userHasSubjectLMA && (
        <StyledDashboardInfo>
          <StyledTopRowDashboardInfo>
            <TableTitle
              title={t('welcomePage.lmaSubjectsHeading')}
              description={t('welcomePage.lmaSubjectsDescription')}
              Icon={BookOpen}
            />
            <ControlWrapperDashboard>
              <SubjectDropdown
                subjectIds={allSubjectIds || []}
                filterSubject={filterSubject}
                setFilterSubject={setFilterSubject}
              />
              <SwitchWrapper>
                <StyledSwitch
                  checked={hideOnHold}
                  onChange={(checked) => setHideOnHold(checked)}
                  label={t('welcomePage.workList.onHoldFilter')}
                  id="filter-on-hold-switch"
                />
              </SwitchWrapper>
            </ControlWrapperDashboard>
          </StyledTopRowDashboardInfo>
          <TableComponent
            isLoading={searchQuery.isLoading}
            tableTitleList={tableTitles}
            tableData={tableData}
            error={error}
            noResultsText={`${t('welcomePage.noResultsLMASubjects')}: ${EXCLUDE_STATUSES.map(
              (status) => t(`form.status.actions.${status}`),
            ).join(', ')}`}
          />
        </StyledDashboardInfo>
      )}
    </>
  );
};

export default LMASubjects;
