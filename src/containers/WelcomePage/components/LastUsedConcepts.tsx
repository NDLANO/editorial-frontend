/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PencilFill } from "@ndla/icons";
import { SafeLink } from "@ndla/safelink";
import { ConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/abstractions/Pagination";
import { STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT } from "../../../constants";
import formatDate from "../../../util/formatDate";
import { routes } from "../../../util/routeHelpers";
import { useLocalStoragePageSizeState } from "../hooks/storedFilterHooks";
import { StyledTopRowDashboardInfo } from "../styles";
import { SortOptionLastUsed } from "../types";
import TableComponent, { FieldElement, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import { getCurrentPageData } from "./utils";
import PageSizeSelect from "./worklist/PageSizeSelect";
import StatusCell from "./worklist/StatusCell";

interface Props {
  data: ConceptSummaryDTO[];
  isLoading: boolean;
  error: string | undefined;
  titles: TitleElement<SortOptionLastUsed>[];
  totalCount: number | undefined;
}

const LastUsedConcepts = ({ data: propData, isLoading, error, titles, totalCount }: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT);

  const data = useMemo(() => getCurrentPageData(page, propData, Number(pageSize.value)), [propData, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

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
        aria-label={t("welcomePage.pagination.lastUsed", { resourceType: t("welcomePage.pagination.concepts") })}
        buttonSize="small"
      />
    </>
  );
};

export default LastUsedConcepts;
