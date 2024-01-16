/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import Pager from '@ndla/pager';
import { SingleValue } from '@ndla/select';
import { IArticleSummary } from '@ndla/types-backend/draft-api';
import { SortOptionLastUsed } from './LastUsedItems';
import TableComponent, { FieldElement, Prefix, TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import PageSizeDropdown from './worklist/PageSizeDropdown';
import formatDate from '../../../util/formatDate';
import { toEditArticle } from '../../../util/routeHelpers';
import { StyledLink, StyledTopRowDashboardInfo, TopRowControls } from '../styles';

interface Props {
  data: IArticleSummary[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  sortOption: string;
  setSortOption: (o: Prefix<'-', SortOptionLastUsed>) => void;
  error: string | undefined;
  lastPage: number;
  titles: TitleElement<SortOptionLastUsed>[];
  pageSize: SingleValue;
  setPageSize: (p: SingleValue) => void;
}

const LastUsedResources = ({
  data = [],
  isLoading,
  page,
  setPage,
  sortOption,
  setSortOption,
  error,
  lastPage,
  titles,
  pageSize,
  setPageSize,
}: Props) => {
  const { t } = useTranslation();

  const tableData: FieldElement[][] = useMemo(
    () =>
      data?.map((a) => [
        {
          id: `title_${a.id}`,
          data: (
            <StyledLink to={toEditArticle(a.id, a.articleType)} title={a.title?.title}>
              {a.title?.title}
            </StyledLink>
          ),
        },
        { id: `lastUpdated_${a.id}`, data: formatDate(a.updated) },
      ]) ?? [[]],
    [data],
  );

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t('welcomePage.lastUsed')}
          description={t('welcomePage.lastUsedDescription')}
          Icon={Pencil}
        />
        <TopRowControls>
          <PageSizeDropdown pageSize={pageSize} setPageSize={setPageSize} />
        </TopRowControls>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={titles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t('welcomePage.emptyLastUsed')}
        minWidth="250px"
      />
      <Pager
        page={page}
        lastPage={lastPage}
        query={{}}
        onClick={(el) => setPage(el.page)}
        small
        colorTheme="lighter"
        pageItemComponentClass="button"
      />
    </>
  );
};

export default LastUsedResources;
