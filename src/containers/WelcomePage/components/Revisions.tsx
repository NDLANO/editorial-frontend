/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { memo, useEffect, useMemo, useState } from 'react';
import { IUserData } from '@ndla/types-backend/draft-api';
import { Alarm } from '@ndla/icons/common';
import addYears from 'date-fns/addYears';
import { Select, SingleValue } from '@ndla/select';
import Pager from '@ndla/pager';
import sortBy from 'lodash/sortBy';
import styled from '@emotion/styled';
import { mq, breakpoints } from '@ndla/core';
import {
  ControlWrapperDashboard,
  DropdownWrapper,
  StyledDashboardInfo,
  StyledLink,
  StyledTopRowDashboardInfo,
} from '../styles';
import TableComponent, { FieldElement, Prefix, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import formatDate, { formatDateForBackend } from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';
import { useSearch } from '../../../modules/search/searchQueries';
import { getExpirationDate } from '../../ArticlePage/articleTransformers';
import GoToSearch from './GoToSearch';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { useSearchNodes } from '../../../modules/nodes/nodeQueries';
import { SUBJECT_NODE } from '../../../modules/nodes/nodeApiTypes';

const RevisionsWrapper = styled.div`
  ${mq.range({ from: breakpoints.tabletWide })} {
    margin-top: 25px;
  }
`;

interface Props {
  userData: IUserData | undefined;
  ndlaId: string | undefined;
}

type SortOptionRevision = 'title' | 'revisionDate' | 'status';

const Revisions = ({ userData, ndlaId }: Props) => {
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [sortOption, setSortOption] = useState<Prefix<'-', SortOptionRevision>>('revisionDate');
  const [error, setError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const tableTitles: TitleElement<SortOptionRevision>[] = [
    { title: t('form.article.label'), sortableField: 'title' },
    { title: t('welcomePage.workList.status'), sortableField: 'status' },
    { title: t('welcomePage.workList.primarySubject') },
    { title: t('welcomePage.revisionDate'), sortableField: 'revisionDate' },
  ];

  const currentDateAddYear = formatDateForBackend(addYears(new Date(), 1));

  const { data, isInitialLoading } = useSearch(
    {
      subjects: filterSubject ? filterSubject.value : userData?.favoriteSubjects?.join(','),
      'revision-date-to': currentDateAddYear,
      sort: sortOption,
      page: page,
      'page-size': 6,
      language,
      fallback: true,
    },
    {
      enabled: !!userData?.favoriteSubjects?.length,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  const { data: subjectData, isInitialLoading: isInitialLoadingSubjects } = useSearchNodes(
    {
      nodeType: SUBJECT_NODE,
      taxonomyVersion,
      ids: userData?.favoriteSubjects,
      language,
    },
    {
      select: (res) => ({
        ...res,
        results: sortBy(res.results, (r) => r.metadata.customFields.subjectCategory === 'archive'),
      }),
      enabled: !!userData?.favoriteSubjects?.length,
    },
  );

  const favoriteSubjects = useMemo(
    () => subjectData?.results.map((s) => ({ label: s.name, value: s.id })),
    [subjectData],
  );

  const lastPage = data?.totalCount ? Math.ceil(data?.totalCount / (data.pageSize ?? 1)) : 1;

  useEffect(() => {
    setPage(1);
  }, [filterSubject]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      data?.results?.map((a) => [
        {
          id: `title_${a.id}`,
          data: (
            <StyledLink to={toEditArticle(a.id, a.learningResourceType)} title={a.title?.title}>
              {a.title?.title}
            </StyledLink>
          ),
        },
        {
          id: `status_${a.id}`,
          data: a.status?.current ? t(`form.status.${a.status.current.toLowerCase()}`) : '',
        },
        {
          id: `primarySubject_${a.id}`,
          data: a.contexts.find((context) => context.isPrimaryConnection)?.subject ?? '',
        },
        {
          id: `lastUpdated_${a.id}`,
          data: a.revisions.length
            ? formatDate(getExpirationDate({ revisions: a.revisions })!)
            : null,
        },
      ]) ?? [[]],
    [data?.results, t],
  );

  return (
    <RevisionsWrapper>
      <StyledDashboardInfo>
        <StyledTopRowDashboardInfo>
          <TableTitle
            title={t('welcomePage.revision')}
            description={t('welcomePage.revisionDescription')}
            Icon={Alarm}
            infoText={t('welcomePage.revisionInfo')}
          />
          <ControlWrapperDashboard>
            <DropdownWrapper>
              <Select<false>
                label={t('welcomePage.chooseFavoriteSubject')}
                options={favoriteSubjects ?? []}
                placeholder={t('welcomePage.chooseFavoriteSubject')}
                value={filterSubject}
                onChange={setFilterSubject}
                menuPlacement="bottom"
                small
                outline
                isLoading={isInitialLoadingSubjects}
                isSearchable
                noOptionsMessage={() => t('form.responsible.noResults')}
                isClearable
              />
            </DropdownWrapper>
            <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject} searchEnv="content" />
          </ControlWrapperDashboard>
        </StyledTopRowDashboardInfo>
        <TableComponent
          isLoading={isInitialLoading}
          tableTitleList={tableTitles}
          tableData={tableData}
          setSortOption={setSortOption}
          sortOption={sortOption}
          error={error}
          noResultsText={t('welcomePage.emptyRevision')}
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
      </StyledDashboardInfo>
    </RevisionsWrapper>
  );
};

export default memo(Revisions);
