/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import { IArticle } from '@ndla/types-draft-api';
import { StyledDashboardInfo, StyledLink } from '../styles';
import TableComponent, { FieldElement, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import { fetchDrafts } from '../../../modules/draft/draftApi';
import formatDate from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';

interface Props {
  lastUsed?: number[];
}

const LastUsedItems = ({ lastUsed = [] }: Props) => {
  const { t } = useTranslation();

  const tableTitles: TitleElement[] = [
    { title: 'Artikkel', sortableField: 'title' },
    { title: 'Sist oppdatert', sortableField: 'lastUpdated' },
  ];
  const [articleData, setArticleData] = useState<IArticle[] | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const updateSortOption = useCallback((v: string) => setSortOption(v), []);

  useEffect(() => {
    (async () => {
      try {
        const drafts = await fetchDrafts(lastUsed);
        setArticleData(drafts);
        setError(undefined);
      } catch (e) {
        setError(t('welcomePage.errorMessage'));
      }
    })();
  }, [lastUsed, t]);

  const tableData: FieldElement[][] = articleData?.map(a => [
    {
      id: `title_${a.id}`,
      data: <StyledLink to={toEditArticle(a.id, a.articleType)}>{a.title?.title}</StyledLink>,
    },
    { id: `lastUpdated_${a.id}`, data: formatDate(a.updated) },
  ]) ?? [[]];

  return (
    <StyledDashboardInfo>
      <TableTitle
        title={t('welcomePage.lastUsed')}
        description={t('welcomePage.lastUsedDescription')}
        Icon={Pencil}
      />
      <TableComponent
        isLoading={false}
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

export default memo(LastUsedItems);
