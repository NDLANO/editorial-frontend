/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "@ndla/icons/editor";
import { SafeLink } from "@ndla/safelink";
import { IConceptSearchResult } from "@ndla/types-backend/concept-api";
import PageSizeSelect from "./PageSizeSelect";
import StatusCell from "./StatusCell";
import SubjectCombobox from "./SubjectCombobox";
import { SortOptionConceptList } from "./WorkList";
import Pagination from "../../../../components/abstractions/Pagination";
import { useSearchConcepts } from "../../../../modules/concept/conceptQueries";
import { toEditConcept, toEditGloss } from "../../../../util/routeHelpers";
import { ControlWrapperDashboard, StyledTopRowDashboardInfo, TopRowControls } from "../../styles";
import { SelectItem } from "../../types";
import GoToSearch from "../GoToSearch";
import TableComponent, { FieldElement, Prefix, TitleElement } from "../TableComponent";
import TableTitle from "../TableTitle";

interface Props {
  data: IConceptSearchResult | undefined;
  filterSubject: SelectItem | undefined;
  isPending: boolean;
  setSortOption: (o: Prefix<"-", SortOptionConceptList>) => void;
  sortOption: string;
  error: string | undefined;
  setFilterSubject: (fs: SelectItem) => void;
  ndlaId: string;
  setPageConcept: (page: number) => void;
  pageSizeConcept: SelectItem;
  setPageSizeConcept: (p: SelectItem) => void;
}

const ConceptListTabContent = ({
  data,
  filterSubject,
  isPending,
  setSortOption,
  sortOption,
  error,
  setFilterSubject,
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
              id: `concept_subject_${res.id}`,
              data: res.subjectName,
            },
            {
              id: `date_${res.id}`,
              data: res.lastUpdated,
            },
          ])
        : [[]],
    [data, t],
  );

  const tableTitles: TitleElement<SortOptionConceptList>[] = [
    {
      title: t("welcomePage.workList.title"),
      sortableField: "title",
      width: "25%",
    },
    {
      title: t("welcomePage.workList.status"),
      sortableField: "status",
      width: "20%",
    },
    { title: t("welcomePage.workList.contentType"), width: "20%", sortableField: "conceptType" },
    { title: t("welcomePage.workList.conceptSubject"), width: "20%", sortableField: "subject" },
    {
      title: t("welcomePage.workList.date"),
      sortableField: "responsibleLastUpdated",
      width: "15%",
    },
  ];

  const subjectIds = searchQuery.data?.aggregations.flatMap((a) => a.values.map((v) => v.value));

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t("welcomePage.workList.heading")}
          description={t("welcomePage.workList.conceptDescription")}
          Icon={Calendar}
        />
        <ControlWrapperDashboard>
          <TopRowControls>
            <PageSizeSelect pageSize={pageSizeConcept} setPageSize={setPageSizeConcept} />
            {setFilterSubject && (
              <>
                <SubjectCombobox
                  subjectIds={subjectIds ?? []}
                  filterSubject={filterSubject}
                  setFilterSubject={setFilterSubject}
                />
                <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject?.value} searchEnv="content" />
              </>
            )}
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
