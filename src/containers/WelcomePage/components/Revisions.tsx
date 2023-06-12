/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { IUserData } from '@ndla/types-backend/draft-api';
import { Alarm } from '@ndla/icons/common';
import addYears from 'date-fns/addYears';
import { Select, SingleValue } from '@ndla/select';
import Pager from '@ndla/pager';
import sortBy from 'lodash/sortBy';
import styled from '@emotion/styled';
import { mq, breakpoints, spacing, fonts } from '@ndla/core';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import { Switch } from '@ndla/switch';
import Tooltip from '@ndla/tooltip';
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
import { FAVOURITES_SUBJECT_ID } from '../../../constants';

const RevisionsWrapper = styled.div`
  ${mq.range({ from: breakpoints.tabletWide })} {
    margin-top: 25px;
  }
`;

const SwitchWrapper = styled.div`
  margin-top: ${spacing.small};
  & button {
    margin-left: auto;
  }
`;

const StyledSwitch = styled(Switch)`
  white-space: nowrap;
  label {
    font-size: ${fonts.sizes('16px')};
    margin-left: auto;
  }
`;

const StyledRevisionControls = styled.div`
  display: flex;
  flex-direction: column;
`;

const getLastPage = (totalCount: number, pageSize: number) =>
  Math.ceil(totalCount / (pageSize ?? 1));

interface Props {
  userData: IUserData | undefined;
}

type SortOptionRevision = 'title' | 'revisionDate' | 'status';

const Revisions = ({ userData }: Props) => {
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [sortOption, setSortOption] = useState<Prefix<'-', SortOptionRevision>>('revisionDate');
  const [error, setError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState(false);

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const tableTitles: TitleElement<SortOptionRevision>[] = [
    { title: t('form.name.title'), sortableField: 'title' },
    { title: t('welcomePage.workList.status'), sortableField: 'status', width: '15%' },
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

  const getDataPrimaryConnectionToFavorite = useCallback(
    (results: IMultiSearchSummary[] | undefined) => {
      const filteredResult = results
        ?.map((r) => {
          const primarySubject = r.contexts.find((c) => c.isPrimary);
          const isFavorite = userData?.favoriteSubjects?.some(
            (fs) => fs === primarySubject?.rootId,
          );
          return isFavorite ? r : undefined;
        })
        .filter((fd): fd is IMultiSearchSummary => !!fd);

      return { results: filteredResult, totalCount: filteredResult?.length ?? 0, pageSize: 6 };
    },
    [userData?.favoriteSubjects],
  );

  const filteredData = useMemo(
    () =>
      checked
        ? getDataPrimaryConnectionToFavorite(data?.results)
        : { results: data?.results, totalCount: data?.totalCount, pageSize: data?.pageSize ?? 6 },
    [checked, data?.pageSize, data?.results, data?.totalCount, getDataPrimaryConnectionToFavorite],
  );

  const lastPage = useMemo(
    () =>
      filteredData.totalCount ? getLastPage(filteredData.totalCount, filteredData.pageSize) : 1,
    [filteredData.pageSize, filteredData.totalCount],
  );

  useEffect(() => {
    setPage(1);
  }, [filterSubject]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      filteredData.results?.map((a) => [
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
    [filteredData, t],
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
          <StyledRevisionControls>
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
              <GoToSearch
                filterSubject={filterSubject?.value ?? FAVOURITES_SUBJECT_ID}
                searchEnv="content"
                revisionDateTo={currentDateAddYear}
              />
            </ControlWrapperDashboard>
            <Tooltip tooltip={t('welcomePage.primaryConnection')}>
              <SwitchWrapper>
                <StyledSwitch
                  checked={checked}
                  onChange={() => {
                    setChecked(!checked);
                    setPage(1);
                  }}
                  label={t('welcomePage.primaryConnectionLabel')}
                  id="filter-primary-connection-switch"
                  aria-label={t('welcomePage.primaryConnection')}
                  thumbCharacter="P"
                />
              </SwitchWrapper>
            </Tooltip>
          </StyledRevisionControls>
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
