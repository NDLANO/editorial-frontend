/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import orderBy from 'lodash/orderBy';
import { StyledDashboardInfo, StyledLink } from '../styles';
import TableComponent, { FieldElement, Prefix, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import formatDate from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';
import { useSearchDrafts } from '../../../modules/draft/draftQueries';

interface Props {
  lastUsed?: number[];
}

type SortOptionLastUsed = 'title' | 'lastUpdated';

const LastUsedItems = ({ lastUsed = [] }: Props) => {
  const { t } = useTranslation();

  const tableTitles: TitleElement<SortOptionLastUsed>[] = [
    { title: t('form.article.label'), sortableField: 'title' },
    { title: t('searchForm.sort.lastUpdated'), sortableField: 'lastUpdated' },
  ];
  const [sortOption, setSortOption] = useState<Prefix<'-', SortOptionLastUsed>>('-lastUpdated');
  const [error, setError] = useState<string | undefined>(undefined);

  const { data, isInitialLoading } = useSearchDrafts(
    {
      ids: lastUsed!,
      sort: '-lastUpdated',
    },
    {
      enabled: !!lastUsed.length,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  const sortedData = useMemo(() => {
    if (!data?.results) return [];
    const sortDesc = sortOption.charAt(0) === '-';
    return orderBy(
      data.results,
      (t) => (sortOption.includes('title') ? t.title?.title : t.updated),
      [sortDesc ? 'desc' : 'asc'],
    );
  }, [data?.results, sortOption]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      sortedData?.map((a) => [
        {
          id: `title_${a.id}`,
          data: <StyledLink to={toEditArticle(a.id, a.articleType)}>{a.title?.title}</StyledLink>,
        },
        { id: `lastUpdated_${a.id}`, data: formatDate(a.updated) },
      ]) ?? [[]],
    [sortedData],
  );

  return (
    <StyledDashboardInfo>
      <TableTitle
        title={t('welcomePage.lastUsed')}
        description={t('welcomePage.lastUsedDescription')}
        Icon={Pencil}
      />
      <TableComponent
        isLoading={isInitialLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t('welcomePage.emptyLastUsed')}
      />
    </StyledDashboardInfo>
  );
};

export default LastUsedItems;
