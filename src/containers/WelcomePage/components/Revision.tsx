/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import { useMemo } from 'react';
import { StyledDashboardInfo, StyledLink } from '../styles';
import TableComponent, { FieldElement, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import formatDate from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';

const Revision = () => {
  const { t, i18n } = useTranslation();

  const tableTitles: TitleElement[] = [
    { title: t('form.article.label'), sortableField: 'title' },
    { title: t('searchForm.sort.lastUpdated'), sortableField: 'lastUpdated' },
  ];

  const tableData: FieldElement[][] = useMemo(
    () =>
      [{ id: 'lol', articleType: 'lol', title: { title: 'lol' }, updated: '2020-01-01' }]?.map(
        a => [
          {
            id: `title_${a.id}`,
            data: <StyledLink to={toEditArticle(a.id, a.articleType)}>{a.title?.title}</StyledLink>,
          },
          { id: `lastUpdated_${a.id}`, data: formatDate(a.updated) },
        ],
      ) ?? [[]],
    [],
  );

  return (
    <StyledDashboardInfo>
      <TableTitle
        title={t('welcomePage.revision')}
        description={t('welcomePage.revisionDescription')}
        Icon={Pencil}
      />
      <TableComponent
        // isLoading={isInitialLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={() => console.log('update sort!')}
        //  sortOption={sortOption}
        //   error={error}
        noResultsText={t('welcomePage.emptyRevision')}
        isLoading={false}
      />
    </StyledDashboardInfo>
  );
};

export default Revision;
