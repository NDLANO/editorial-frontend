/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Calendar } from '@ndla/icons/editor';
import { SingleValue } from '@ndla/select';
import { IMultiSearchResult } from '@ndla/types-backend/search-api';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Pager from '@ndla/pager';
import { Comment } from '@ndla/icons/common';
import Tooltip from '@ndla/tooltip';
import styled from '@emotion/styled';
import formatDate from '../../../../util/formatDate';
import { toEditArticle } from '../../../../util/routeHelpers';
import { ControlWrapperDashboard, StyledLink, StyledTopRowDashboardInfo } from '../../styles';
import SubjectDropdown from './SubjectDropdown';
import TableComponent, { FieldElement, Prefix, TitleElement } from '../TableComponent';
import TableTitle from '../TableTitle';
import GoToSearch from '../GoToSearch';
import { SortOption } from './WorkList';
import StatusCell from './StatusCell';

export const CellWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  data?: IMultiSearchResult;
  filterSubject?: SingleValue;
  isLoading: boolean;
  setSortOption: (o: Prefix<'-', SortOption>) => void;
  sortOption: string;
  error: string | undefined;
  setFilterSubject: (fs: SingleValue) => void;
  ndlaId?: string;
  setPage: (page: number) => void;
}

const WorkListTabContent = ({
  data,
  filterSubject,
  setSortOption,
  isLoading,
  sortOption,
  error,
  setFilterSubject,
  ndlaId,
  setPage,
}: Props) => {
  const { t } = useTranslation();

  const tableData: FieldElement[][] = useMemo(
    () =>
      data
        ? data.results.map((res) => [
            {
              id: `title_${res.id}`,
              data: (
                <CellWrapper>
                  <StyledLink
                    to={toEditArticle(res.id, res.learningResourceType)}
                    title={res.title?.title}
                  >
                    {res.title?.title}
                  </StyledLink>
                  {res.comments?.length ? (
                    <Tooltip tooltip={res.comments[0]?.content}>
                      <div>
                        <Comment />
                      </div>
                    </Tooltip>
                  ) : null}
                </CellWrapper>
              ),
            },
            {
              id: `status_${res.id}`,
              data: <StatusCell status={res.status} />,
            },
            {
              id: `contentType_${res.id}`,
              data:
                res.learningResourceType === 'topic-article'
                  ? 'Emne'
                  : res.contexts?.[0]?.resourceTypes?.map((context) => context.name).join(' - '),
            },
            {
              id: `primarySubject_${res.id}`,
              data: res.contexts.find((context) => context.isPrimaryConnection)?.subject ?? '',
            },
            {
              id: `topic_${res.id}`,
              data: res.contexts.length
                ? res.contexts[0].breadcrumbs[res.contexts[0].breadcrumbs.length - 1]
                : '',
            },
            {
              id: `date_${res.id}`,
              data: res.responsible ? formatDate(res.responsible.lastUpdated) : '',
              width: '10%',
            },
          ])
        : [[]],
    [data],
  );

  const tableTitles: TitleElement<SortOption>[] = [
    { title: t('welcomePage.workList.title'), sortableField: 'title', width: '30%' },
    { title: t('welcomePage.workList.status'), sortableField: 'status', width: '10%' },
    { title: t('welcomePage.workList.contentType') },
    { title: t('welcomePage.workList.primarySubject') },
    { title: t('welcomePage.workList.topicRelation') },
    {
      title: t('welcomePage.workList.date'),
      sortableField: 'responsibleLastUpdated',
      width: '10%',
    },
  ];

  const lastPage = data?.totalCount ? Math.ceil(data?.totalCount / (data.pageSize ?? 1)) : 1;

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t('welcomePage.workList.heading')}
          description={t('welcomePage.workList.description')}
          Icon={Calendar}
        />
        <ControlWrapperDashboard>
          <SubjectDropdown filterSubject={filterSubject} setFilterSubject={setFilterSubject} />
          <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject?.value} searchEnv={'content'} />
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t('welcomePage.noArticles')}
        minWidth="850px"
      />
      <Pager
        page={data?.page ?? 1}
        lastPage={lastPage}
        query={{}}
        onClick={(el) => setPage(el.page)}
        small
        colorTheme="lighter"
        pageItemComponentClass="button"
      />
    </>
  );
};

export default WorkListTabContent;
