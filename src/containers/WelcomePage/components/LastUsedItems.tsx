/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import orderBy from 'lodash/orderBy';
import { IArticleSummary } from '@ndla/types-draft-api';
import { StyledDashboardInfo, StyledLink } from '../styles';
import TableComponent, { FieldElement, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import formatDate from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';
import { useSearchDrafts } from '../../../modules/draft/draftQueries';

interface Props {
  lastUsed?: number[];
}

const LastUsedItems = ({ lastUsed = [] }: Props) => {
  const { t, i18n } = useTranslation();

  const tableTitles: TitleElement[] = [
    { title: t('form.article.label'), sortableField: 'title' },
    { title: t('searchForm.sort.lastUpdated'), sortableField: 'lastUpdated' },
  ];
  const [sortOption, setSortOption] = useState<string | undefined>('-lastUpdated');
  const [error, setError] = useState<string | undefined>(undefined);
  const [sortedData, setSortedData] = useState<IArticleSummary[]>([]);

  const { data, isLoading } = useSearchDrafts(
    {
      ids: lastUsed!,
      language: i18n.language,
      sort: '-lastUpdated',
    },
    {
      enabled: !!lastUsed.length,
      onError: () => setError(t('welcomePage.errorMessage')),
      onSuccess: () => setError(undefined),
    },
  );

  useEffect(() => {
    if (data) {
      setSortedData(data.results);
    }
  }, [data]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      sortedData?.map(a => [
        {
          id: `title_${a.id}`,
          data: <StyledLink to={toEditArticle(a.id, a.articleType)}>{a.title?.title}</StyledLink>,
        },
        { id: `lastUpdated_${a.id}`, data: formatDate(a.updated) },
      ]) ?? [[]],
    [sortedData],
  );

  const updateSortOption = useCallback(
    (sortableField: string) => {
      const sortDesc = sortableField.charAt(0) === '-';
      const sorted = orderBy(
        sortedData,
        t => (sortableField.includes('title') ? t.title?.title : t.updated),
        [sortDesc ? 'desc' : 'asc'],
      );

      setSortedData(sorted);
      setSortOption(sortableField);
    },
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
        isLoading={isLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={updateSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t('welcomePage.emptyLastUsed')}
      />
    </StyledDashboardInfo>
  );
};

export default LastUsedItems;
