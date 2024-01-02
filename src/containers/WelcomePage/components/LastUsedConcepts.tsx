/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "@ndla/icons/action";
import Pager from "@ndla/pager";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { SortOptionLastUsed } from "./LastUsedItems";
import TableComponent, { FieldElement, Prefix, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import formatDate from "../../../util/formatDate";
import { toEditConcept, toEditGloss } from "../../../util/routeHelpers";
import { StyledLink } from "../styles";

interface Props {
  data: IConceptSummary[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  sortOption: string;
  setSortOption: (o: Prefix<"-", SortOptionLastUsed>) => void;
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
            <StyledLink
              to={a.conceptType === "concept" ? toEditConcept(a.id) : toEditGloss(a.id)}
              title={a.title?.title}
            >
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
      <TableTitle title={t("welcomePage.lastUsed")} description={t("welcomePage.lastUsedConcepts")} Icon={Pencil} />
      <TableComponent
        isLoading={isLoading}
        tableTitleList={titles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t("welcomePage.emptyLastUsed")}
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
