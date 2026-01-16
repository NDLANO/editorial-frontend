/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PencilFill } from "@ndla/icons";
import { SafeLink } from "@ndla/safelink";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { STORED_PAGE_SIZE_LAST_UPDATED } from "../../../constants";
import { useLocalStoragePageSizeState } from "../hooks/storedFilterHooks";
import { SortOptionLastUsed } from "../types";
import TableComponent, { FieldElement, TitleElement } from "./TableComponent";
import { getCurrentPageData } from "./utils";
import StatusCell from "./worklist/StatusCell";
import formatDate from "../../../util/formatDate";
import { routes } from "../../../util/routeHelpers";
import { StyledTopRowDashboardInfo } from "../styles";
import TableTitle from "./TableTitle";
import PageSizeSelect from "./worklist/PageSizeSelect";
import Pagination from "../../../components/abstractions/Pagination";

interface Props {
  data: MultiSearchSummaryDTO[];
  isLoading: boolean;
  error: string | undefined;
  titles: TitleElement<SortOptionLastUsed>[];
  totalCount: number | undefined;
}

export const LastUsedLearningpaths = ({ data: propData, isLoading, error, titles, totalCount }: Props) => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_LAST_UPDATED);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const data = useMemo(
    () => (propData ? getCurrentPageData(page, propData, Number(pageSize!.value)) : []),
    [propData, page, pageSize],
  );

  const tableData: FieldElement[][] = useMemo(
    () =>
      data?.map((a) => [
        {
          id: `title_${a.id}`,
          data: (
            <SafeLink to={routes.learningpath.edit(a.id, i18n.language)} title={a.title?.title}>
              {a.title?.title}
            </SafeLink>
          ),
        },
        { id: `status_${a.id}`, data: <StatusCell status={a.status} /> },
        { id: `lastUpdated_${a.id}`, data: formatDate(a.lastUpdated) },
      ]) ?? [[]],
    [data, i18n.language],
  );

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t("welcomePage.lastUsed")}
          description={t("welcomePage.lastUsedDescription")}
          Icon={PencilFill}
        />
        <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={titles}
        tableData={tableData}
        error={error}
        noResultsText={t("welcomePage.emptyLastUsed")}
        minWidth="500px"
      />
      <Pagination
        page={page}
        onPageChange={(details) => setPage(details.page)}
        count={totalCount ?? 0}
        pageSize={Number(pageSize!.value)}
        aria-label={t("welcomePage.pagination.lastUsed", { resourceType: t("welcomePage.pagination.resources") })}
        buttonSize="small"
      />
    </>
  );
};
