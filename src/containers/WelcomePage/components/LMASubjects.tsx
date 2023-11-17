/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { IUserData } from '@ndla/types-backend/draft-api';
import { BookOpen } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { StyledDashboardInfo, StyledLink, StyledTopRowDashboardInfo } from '../styles';
import TableComponent, { FieldElement } from './TableComponent';
import TableTitle from './TableTitle';
import {
  ARCHIVED,
  LMA_SUBJECT_ID,
  PUBLISHED,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
  UNPUBLISHED,
} from '../../../constants';
import { useNodes } from '../../../modules/nodes/nodeQueries';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { useSearch } from '../../../modules/search/searchQueries';
import { toSearch } from '../../../util/routeHelpers';

const EXCLUDE_STATUSES = [PUBLISHED, UNPUBLISHED, ARCHIVED];

interface Props {
  userData: IUserData | undefined;
}

const LMASubjects = ({ userData }: Props) => {
  const { i18n, t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const subjectsQuery = useNodes(
    {
      language: i18n.language,
      taxonomyVersion,
      nodeType: 'SUBJECT',
      key: TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
      value: userData?.userId,
    },
    { enabled: !!userData?.userId },
  );

  const userHasSubjectLMA = !!subjectsQuery.data?.length;

  const searchQuery = useSearch(
    {
      'page-size': 0,
      'aggregate-paths': 'draftStatus.current',
      subjects: subjectsQuery.data?.map((s) => s.id).join(','),
    },
    {
      enabled: userHasSubjectLMA,
    },
  );

  const searchError = useMemo(() => {
    if (searchQuery.isError) {
      return t('welcomePage.errorMessage');
    }
  }, [searchQuery.isError, t]);

  const tableTitles = [
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.count') },
  ];

  const tableData: FieldElement[][] = useMemo(() => {
    const statusAggregationData =
      searchQuery.data?.aggregations[0].values.filter((v) => !EXCLUDE_STATUSES.includes(v.value)) ??
      [];

    return (
      statusAggregationData.map((statusData) => {
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
        ];
      }) ?? [[]]
    );
  }, [searchQuery.data?.aggregations, t]);

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
          </StyledTopRowDashboardInfo>
          <TableComponent
            isLoading={searchQuery.isLoading}
            tableTitleList={tableTitles}
            tableData={tableData}
            error={searchError}
          />
        </StyledDashboardInfo>
      )}
    </>
  );
};

export default LMASubjects;
