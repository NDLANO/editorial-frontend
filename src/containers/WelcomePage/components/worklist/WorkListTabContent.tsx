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
import TableComponent, { FieldElement, TitleElement } from '../TableComponent';
import TableTitle from '../TableTitle';
import GoToSearch from '../GoToSearch';

const TitleCell = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  data?: IMultiSearchResult;
  filterSubject?: SingleValue;
  isLoading: boolean;
  setSortOption: (o: string) => void;
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
                <TitleCell>
                  <StyledLink to={toEditArticle(res.id, res.learningResourceType)}>
                    {res.title?.title}
                  </StyledLink>
                  {res.comments?.length ? (
                    <Tooltip tooltip={res.comments[0]?.content.substring(0, 50)}>
                      <div>
                        <Comment />
                      </div>
                    </Tooltip>
                  ) : null}
                </TitleCell>
              ),
            },
            {
              id: `status_${res.id}`,
              data: res.status?.current ? t(`form.status.${res.status.current.toLowerCase()}`) : '',
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
            },
          ])
        : [[]],
    [data, t],
  );
  const tableTitles: TitleElement[] = [
    { title: t('welcomePage.workList.name'), sortableField: 'title' },
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.workList.contentType') },
    { title: t('welcomePage.workList.primarySubject') },
    { title: t('welcomePage.workList.topicRelation') },
    { title: t('welcomePage.workList.date'), sortableField: 'responsibleLastUpdated' },
  ];

  const lastPage = data?.totalCount ? Math.ceil(data?.totalCount / (data.pageSize ?? 1)) : 1;

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t('welcomePage.workList.title')}
          description={t('welcomePage.workList.description')}
          Icon={Calendar}
        />
        <ControlWrapperDashboard>
          <SubjectDropdown filterSubject={filterSubject} setFilterSubject={setFilterSubject} />
          <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject} searchEnv={'content'} />
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
