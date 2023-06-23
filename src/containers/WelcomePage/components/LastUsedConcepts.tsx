/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import { IConceptSummary } from '@ndla/types-backend/concept-api';
import { useMemo } from 'react';
import Pager from '@ndla/pager';
import { StyledLink } from '../styles';
import TableTitle from './TableTitle';
import TableComponent, { FieldElement, Prefix, TitleElement } from './TableComponent';
import { SortOptionLastUsed } from './LastUsedItems';
import { toEditConcept } from '../../../util/routeHelpers';
import formatDate from '../../../util/formatDate';

interface Props {
  data: IConceptSummary[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  sortOption: string;
  setSortOption: (o: Prefix<'-', SortOptionLastUsed>) => void;
  error: string | undefined;
  lastPage: number;
  titles: TitleElement<SortOptionLastUsed>[];
}

const LastUsedConcepts = ({
  data,
  isLoading,
  page,
  setPage,
  sortOption,
  setSortOption,
  error,
  lastPage,
  titles,
}: Props) => {
  const { t } = useTranslation();

  const tableData: FieldElement[][] = useMemo(
    () =>
      data?.map((a) => [
        {
          id: `title_${a.id}`,
          data: (
            <StyledLink to={toEditConcept(a.id)} title={a.title?.title}>
              {a.title.title}
            </StyledLink>
          ),
        },
        { id: `lastUpdated_${a.id}`, data: formatDate(a.lastUpdated) },
      ]) ?? [[]],
    [data],
  );

  return (
    <>
      <TableTitle
        title={t('welcomePage.lastUsed')}
        description={t('welcomePage.lastUsedConcepts')}
        Icon={Pencil}
      />
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

export default LastUsedConcepts;
