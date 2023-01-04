/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Calendar } from '@ndla/icons/editor';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Option, MultiValue } from '@ndla/select';
import { useSearch } from '../../../modules/search/searchQueries';
import { useSession } from '../../Session/SessionProvider';
import { toEditArticle } from '../../../util/routeHelpers';
import TableComponent, { FieldElement, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import SubjectDropdown from './SubjectDropdown';
import formatDate from '../../../util/formatDate';

const StyledWorkList = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  padding: ${spacing.nsmall};
`;

const StyledTopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledLink = styled(Link)`
  line-height: 1.5em;
  &:any-link {
    color: ${colors.brand.primary};
  }
`;

const WorkList = () => {
  const [sortOption, setSortOption] = useState<string>();
  const [filterSubjects, setFilterSubject] = useState<MultiValue>([]);
  const [error, setError] = useState();

  const updateSortOption = useCallback((v: string) => setSortOption(v), []);
  const updateFilterSubjects = useCallback((o: MultiValue) => setFilterSubject(o), []);

  const { ndlaId } = useSession();
  const { t } = useTranslation();
  const { data, isLoading } = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption ? sortOption : '-responsibleLastUpdated',
      ...(filterSubjects.length ? { subjects: filterSubjects.map(fs => fs.value).join(',') } : {}),
    },
    {
      enabled: !!ndlaId,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  const tableTitles: TitleElement[] = [
    { title: t('welcomePage.workList.name'), sortableField: 'title' },
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.workList.contentType') },
    { title: t('welcomePage.workList.primarySubject') },
    { title: t('welcomePage.workList.topicRelation') },
    { title: t('welcomePage.workList.date'), sortableField: 'responsibleLastUpdated' },
  ];

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

  return (
    <>
      {ndlaId && (
        <StyledWorkList>
          <StyledTopRow>
            <TableTitle
              title={t('welcomePage.workList.title')}
              description={t('welcomePage.workList.description')}
              Icon={Calendar}
            />
            <SubjectDropdown
              filterSubject={filterSubjects}
              setFilterSubject={updateFilterSubjects}
            />
          </StyledTopRow>
          <TableComponent
            isLoading={isLoading}
            tableTitleList={tableTitles}
            tableData={tableData}
            setSortOption={updateSortOption}
            sortOption={sortOption}
            error={error}
          />
        </StyledWorkList>
      )}
    </>
  );
};

export default WorkList;
