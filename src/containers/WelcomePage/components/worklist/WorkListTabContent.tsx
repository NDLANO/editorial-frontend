/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Calendar } from '@ndla/icons/editor';
import { SingleValue } from '@ndla/select';
import { IMultiSearchResult } from '@ndla/types-search-api';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { SafeLinkButton } from '@ndla/safelink';
import { useCallback } from 'react';
import queryString from 'query-string';
import formatDate from '../../../../util/formatDate';
import { toEditArticle } from '../../../../util/routeHelpers';
import { StyledLink, StyledTopRowDashboardInfo } from '../../styles';
import SubjectDropdown from './SubjectDropdown';
import TableComponent, { FieldElement, TitleElement } from '../TableComponent';
import TableTitle from '../TableTitle';

const ControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  height: fit-content;
`;

interface Props {
  data: IMultiSearchResult | undefined;
  filterSubject: SingleValue | undefined;
  isLoading: boolean;
  setSortOption: (o: string) => void;
  sortOption: string;
  error: string | undefined;
  setFilterSubject: (fs: SingleValue) => void;
  ndlaId: string;
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
}: Props) => {
  const { t } = useTranslation();

  const tableData: FieldElement[][] = data
    ? data.results.map(res => [
        {
          id: `title_${res.id}`,
          data: (
            <StyledLink to={toEditArticle(res.id, res.learningResourceType)}>
              {res.title?.title}
            </StyledLink>
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
              : res.contexts?.[0]?.resourceTypes?.map(context => context.name).join(' - '),
        },
        {
          id: `primarySubject_${res.id}`,
          data: res.contexts.find(context => context.isPrimaryConnection)?.subject ?? '',
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
    : [[]];

  const tableTitles: TitleElement[] = [
    { title: t('welcomePage.workList.name'), sortableField: 'title' },
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.workList.contentType') },
    { title: t('welcomePage.workList.primarySubject') },
    { title: t('welcomePage.workList.topicRelation') },
    { title: t('welcomePage.workList.date'), sortableField: 'responsibleLastUpdated' },
  ];

  const onSearch = useCallback(() => {
    const query = queryString.stringify({
      ...(filterSubject && { subjects: filterSubject.value }),
      ...(ndlaId && { 'responsible-ids': ndlaId }),
    });

    return `/search/content?${query}`;
  }, [filterSubject, ndlaId]);

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t('welcomePage.workList.title')}
          description={t('welcomePage.workList.description')}
          Icon={Calendar}
        />

        <ControlWrapper>
          <SubjectDropdown filterSubject={filterSubject} setFilterSubject={setFilterSubject} />
          <StyledSafeLinkButton to={onSearch()} size="small">
            {t('welcomePage.goToSearch')}
          </StyledSafeLinkButton>
        </ControlWrapper>
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

export default WorkListTabContent;
