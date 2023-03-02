/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { IUserData } from '@ndla/types-draft-api';
import { Alarm } from '@ndla/icons/common';
import addYears from 'date-fns/addYears';
import { StyledDashboardInfo, StyledLink } from '../styles';
import TableComponent, { FieldElement, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import formatDate, { formatDateForBackend } from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';
import { useSearch } from '../../../modules/search/searchQueries';
import { getExpirationDate } from '../../ArticlePage/articleTransformers';

interface Props {
  userData: IUserData | undefined;
}

const Revision = ({ userData }: Props) => {
  const [sortOption, setSortOption] = useState<string>('-revisionDate');
  const [error, setError] = useState<string | undefined>(undefined);

  const { t } = useTranslation();

  const tableTitles: TitleElement[] = [
    { title: t('form.article.label'), sortableField: 'title' },
    { title: t('welcomePage.workList.status') },
    { title: t('welcomePage.workList.primarySubject') },
    { title: t('welcomePage.revisionDate'), sortableField: 'revisionDate' },
  ];

  const currentDateAddYear = formatDateForBackend(addYears(new Date(), 1));

  const { data, isInitialLoading } = useSearch(
    {
      subjects: userData?.favoriteSubjects!.join(','),
      'revision-date-to': currentDateAddYear,
      sort: sortOption,
    },
    {
      enabled: !!userData?.favoriteSubjects,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  const tableData: FieldElement[][] = useMemo(
    () =>
      data?.results?.map(a => [
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
          data: a.contexts.find(context => context.isPrimaryConnection)?.subject ?? '',
        },
        {
          id: `lastUpdated_${a.id}`,
          data: a.revisions.length && formatDate(getExpirationDate({ revisions: a.revisions })!),
        },
      ]) ?? [[]],
    [data?.results, t],
  );

  return (
    <StyledDashboardInfo>
      <TableTitle
        title={t('welcomePage.revision')}
        description={t('welcomePage.revisionDescription')}
        Icon={Alarm}
      />
      <TableComponent
        isLoading={isInitialLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t('welcomePage.emptyRevision')}
      />
    </StyledDashboardInfo>
  );
};

export default Revision;
