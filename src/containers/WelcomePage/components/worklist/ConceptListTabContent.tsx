/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarLine } from "@ndla/icons";
import { SafeLink } from "@ndla/safelink";
import { IConceptSearchResultDTO } from "@ndla/types-backend/concept-api";
import PageSizeSelect from "./PageSizeSelect";
import StatusCell from "./StatusCell";
import { SortOptionConceptList } from "./WorkList";
import Pagination from "../../../../components/abstractions/Pagination";
import { useSearchConcepts } from "../../../../modules/concept/conceptQueries";
import formatDate from "../../../../util/formatDate";
import { toEditConcept, toEditGloss } from "../../../../util/routeHelpers";
import { ControlWrapperDashboard, StyledTopRowDashboardInfo, TopRowControls } from "../../styles";
import { SelectItem } from "../../types";
import GoToSearch from "../GoToSearch";
import TableComponent, { FieldElement, Prefix, TitleElement } from "../TableComponent";
import TableTitle from "../TableTitle";

interface Props {
  data: IConceptSearchResultDTO | undefined;
  isPending: boolean;
  setSortOption: (o: Prefix<"-", SortOptionConceptList>) => void;
  sortOption: string;
  error: string | undefined;
  ndlaId: string;
  setPageConcept: (page: number) => void;
  pageSizeConcept: SelectItem;
  setPageSizeConcept: (p: SelectItem) => void;
}

const ConceptListTabContent = ({
  data,
  isPending,
  setSortOption,
  sortOption,
  error,
  ndlaId,
  setPageConcept,
  pageSizeConcept,
  setPageSizeConcept,
}: Props) => {
  const { t, i18n } = useTranslation();

  // Separated request to not update subjects when filtered subject changes
  const searchQuery = useSearchConcepts(
    {
      responsibleIds: [ndlaId],
      pageSize: 0,
      fallback: true,
      aggregatePaths: ["subjectIds"],
      language: i18n.language,
    },
    { enabled: !!ndlaId },
  );

  const tableData: FieldElement[][] = useMemo(
    () =>
      data
        ? data.results.map((res) => [
            {
              id: `title_${res.id}`,
              data: (
                <SafeLink
                  to={res.conceptType === "concept" ? toEditConcept(res.id) : toEditGloss(res.id)}
                  title={res.title?.title}
                >
                  {res.title?.title}
                </SafeLink>
              ),
              title: res.title?.title,
            },
            {
              id: `status_${res.id}`,
              data: <StatusCell status={res.status} />,
              title: t(`form.status.${res.status.current.toLowerCase()}`),
            },
            {
              id: `type_${res.id}`,
              data: res.conceptTypeName,
            },
            {
              id: `date_${res.id}`,
              data: res.responsible ? formatDate(res.responsible.lastUpdated) : "",
            },
          ])
        : [[]],
    [data, t],
  );

  const tableTitles: TitleElement<SortOptionConceptList>[] = [
    {
      title: t("welcomePage.workList.title"),
      sortableField: "title",
      width: "35%",
    },
    {
      title: t("welcomePage.workList.status"),
      sortableField: "status",
      width: "20%",
    },
    { title: t("welcomePage.workList.contentType"), width: "20%", sortableField: "conceptType" },
    {
      title: t("welcomePage.workList.date"),
      sortableField: "responsibleLastUpdated",
      width: "15%",
    },
  ];

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t("welcomePage.workList.heading")}
          description={t("welcomePage.workList.conceptDescription")}
          Icon={CalendarLine}
        />
        <ControlWrapperDashboard>
          <TopRowControls>
            <PageSizeSelect pageSize={pageSizeConcept} setPageSize={setPageSizeConcept} />
            <GoToSearch ndlaId={ndlaId} searchEnv="content" />
          </TopRowControls>
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isPending={isPending}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t("welcomePage.emptyConcepts")}
        minWidth="630px"
      />
      <Pagination
        page={data?.page}
        onPageChange={(details) => setPageConcept(details.page)}
        count={data?.totalCount ?? 0}
        pageSize={data?.pageSize}
        aria-label={t("welcomePage.pagination.workList", { resourceType: t("welcomePage.pagination.concepts") })}
        buttonSize="small"
      />
    </>
  );
};

export default ConceptListTabContent;
