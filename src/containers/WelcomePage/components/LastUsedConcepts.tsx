/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PencilFill } from "@ndla/icons/action";
import { SafeLink } from "@ndla/safelink";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { SortOptionLastUsed } from "./LastUsedItems";
import TableComponent, { FieldElement, Prefix, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import PageSizeSelect from "./worklist/PageSizeSelect";
import StatusCell from "./worklist/StatusCell";
import Pagination from "../../../components/abstractions/Pagination";
import formatDate from "../../../util/formatDate";
import { routes } from "../../../util/routeHelpers";
import { StyledTopRowDashboardInfo } from "../styles";
import { SelectItem } from "../types";

interface Props {
  data: IConceptSummary[];
  isPending: boolean;
  page: number;
  setPage: (page: number) => void;
  sortOption: string;
  setSortOption: (o: Prefix<"-", SortOptionLastUsed>) => void;
  error: string | undefined;
  titles: TitleElement<SortOptionLastUsed>[];
  pageSize: SelectItem;
  setPageSize: (p: SelectItem) => void;
  totalCount: number | undefined;
}

const LastUsedConcepts = ({
  data,
  isPending,
  page,
  setPage,
  sortOption,
  setSortOption,
  error,
  titles,
  pageSize,
  setPageSize,
  totalCount,
}: Props) => {
  const { t } = useTranslation();

  const tableData: FieldElement[][] = useMemo(
    () =>
      data?.map((a) => [
        {
          id: `title_${a.id}`,
          data: (
            <SafeLink
              to={a.conceptType === "concept" ? routes.concept.edit(a.id) : routes.gloss.edit(a.id)}
              title={a.title?.title}
            >
              {a.title.title}
            </SafeLink>
          ),
        },
        { id: `status_${a.id}`, data: <StatusCell status={a.status} /> },
        { id: `lastUpdated_${a.id}`, data: formatDate(a.lastUpdated) },
      ]) ?? [[]],
    [data],
  );

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t("welcomePage.lastUsed")}
          description={t("welcomePage.lastUsedConcepts")}
          Icon={PencilFill}
        />
        <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      </StyledTopRowDashboardInfo>
      <TableComponent
        isPending={isPending}
        tableTitleList={titles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t("welcomePage.emptyLastUsed")}
        minWidth="500px"
      />
      <Pagination
        page={page}
        onPageChange={(details) => setPage(details.page)}
        count={totalCount ?? 0}
        pageSize={Number(pageSize!.value)}
        aria-label={t("welcomePage.pagination.lastUsed", { resourceType: t("welcomePage.pagination.concepts") })}
        buttonSize="small"
      />
    </>
  );
};

export default LastUsedConcepts;
