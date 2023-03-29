/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { memo, useEffect, useMemo, useState } from 'react';
import { IUserData } from '@ndla/types-draft-api';
import { Alarm } from '@ndla/icons/common';
import addYears from 'date-fns/addYears';
import { Select, Option, SingleValue } from '@ndla/select';
import Pager from '@ndla/pager';
import {
  ControlWrapperDashboard,
  DropdownWrapper,
  StyledDashboardInfo,
  StyledLink,
  StyledTopRowDashboardInfo,
} from '../styles';
import TableComponent, { FieldElement, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import formatDate, { formatDateForBackend } from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';
import { useSearch } from '../../../modules/search/searchQueries';
import { getExpirationDate } from '../../ArticlePage/articleTransformers';
import GoToSearch from './GoToSearch';
import { fetchSubject } from '../../../modules/taxonomy';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  userData: IUserData | undefined;
  ndlaId: string | undefined;
}

export type SortOptionFieldsRevision = 'title' | 'revisionDate';
export type SortOptionRevision = SortOptionFieldsRevision | '-title' | '-revisionDate';

const Revisions = ({ userData, ndlaId }: Props) => {
  const [favoriteSubjects, setFavoriteSubjects] = useState<Option[]>([]);
  const [filterSubject, setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOptionRevision>('-revisionDate');
  const [error, setError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const tableTitles: TitleElement[] = [
    { title: t('form.article.label'), sortableField: 'title' },
    { title: t('welcomePage.workList.status') },
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
    },
    {
      enabled: !!userData?.favoriteSubjects,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  useEffect(() => {
    (async () => {
      const favoriteSubjects = await Promise.allSettled(
        userData?.favoriteSubjects?.map((id) => fetchSubject({ id, taxonomyVersion })) ?? [],
      );
      const filteredSubjects = (
        favoriteSubjects.filter((fs) => fs.status === 'fulfilled') as Array<
          PromiseFulfilledResult<SubjectType>
        >
      ).map((result) => ({
        value: result.value.id,
        label: result.value.name,
      }));
      setFavoriteSubjects(filteredSubjects);
    })();
  }, [taxonomyVersion, userData?.favoriteSubjects]);

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
            <StyledLink to={toEditArticle(a.id, a.learningResourceType)}>
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
    <StyledDashboardInfo>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t('welcomePage.revision')}
          description={t('welcomePage.revisionDescription')}
          Icon={Alarm}
        />
        <ControlWrapperDashboard>
          <DropdownWrapper>
            <Select<false>
              label={t('welcomePage.chooseFavoriteSubject')}
              options={favoriteSubjects}
              placeholder={t('welcomePage.chooseFavoriteSubject')}
              value={filterSubject}
              onChange={setFilterSubject}
              menuPlacement="bottom"
              small
              outline
              isLoading={isInitialLoading}
              isSearchable
              noOptionsMessage={() => t('form.responsible.noResults')}
              isClearable
            />
          </DropdownWrapper>

          <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject} searchEnv="content" />
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent<SortOptionRevision>
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
  );
};

export default memo(Revisions);
