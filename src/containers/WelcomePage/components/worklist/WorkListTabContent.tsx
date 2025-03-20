/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpDoubleLine, MessageLine, CalendarLine } from "@ndla/icons";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import PageSizeSelect from "./PageSizeSelect";
import StatusCell from "./StatusCell";
import SubjectCombobox from "./SubjectCombobox";
import { SortOptionWorkList } from "./WorkList";
import Pagination from "../../../../components/abstractions/Pagination";
import { MultiSummarySearchResults } from "../../../../modules/search/searchApiInterfaces";
import { useSearch } from "../../../../modules/search/searchQueries";
import formatDate from "../../../../util/formatDate";
import { stripInlineContentHtmlTags } from "../../../../util/formHelper";
import { toEditArticle } from "../../../../util/routeHelpers";
import { ControlWrapperDashboard, StyledTopRowDashboardInfo, TopRowControls } from "../../styles";
import { SelectItem } from "../../types";
import GoToSearch from "../GoToSearch";
import TableComponent, { FieldElement, Prefix, TitleElement } from "../TableComponent";
import TableTitle from "../TableTitle";

const CellWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xxsmall",
  },
});

const TextWrapper = styled("div", {
  base: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

const CommentIndicatorWrapper = styled("div", {
  base: {
    marginInlineStart: "auto",
  },
});

interface Props {
  data: MultiSummarySearchResults | undefined;
  isPending: boolean;
  setSortOption: (o: Prefix<"-", SortOptionWorkList>) => void;
  sortOption: string;
  error: string | undefined;
  ndlaId: string;
  setPage: (page: number) => void;
  pageSize: SelectItem;
  setPageSize: (p: SelectItem) => void;
  filterSubject?: SelectItem;
  setFilterSubject?: (fs: SelectItem) => void;
  setPrioritized?: (prioritized: boolean) => void;
  prioritized?: boolean;
  headerText?: string;
  descriptionText?: string;
}
const WorkListTabContent = ({
  data,
  filterSubject,
  setSortOption,
  isPending,
  sortOption,
  error,
  setFilterSubject,
  ndlaId,
  setPage,
  setPrioritized,
  prioritized,
  pageSize,
  setPageSize,
  headerText = "welcomePage.workList.heading",
  descriptionText = "welcomePage.workList.description",
}: Props) => {
  const { t, i18n } = useTranslation();

  // Separated request to not update subjects when filtered subject changes
  const searchQuery = useSearch(
    {
      responsibleIds: [ndlaId],
      pageSize: 0,
      fallback: true,
      aggregatePaths: ["contexts.rootId"],
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
                <CellWrapper>
                  <ArrowUpDoubleLine
                    aria-hidden={!res?.prioritized}
                    visibility={!res?.prioritized ? "hidden" : "visible"}
                    aria-label={t("editorFooter.prioritized")}
                    title={t("editorFooter.prioritized")}
                    size="small"
                  />
                  <TextWrapper>
                    <SafeLink to={toEditArticle(res.id, res.learningResourceType)} title={res.title?.title}>
                      {res.title?.title}
                    </SafeLink>
                  </TextWrapper>
                  {res.comments?.length ? (
                    <CommentIndicatorWrapper>
                      <MessageLine
                        size="small"
                        title={stripInlineContentHtmlTags(res.comments[0].content)}
                        aria-label={stripInlineContentHtmlTags(res.comments[0].content)}
                      />
                    </CommentIndicatorWrapper>
                  ) : null}
                </CellWrapper>
              ),
            },
            {
              id: `status_${res.id}`,
              data: <StatusCell status={res.status} />,
            },
            {
              id: `contentType_${res.id}`,
              data: res.resourceTypeName,
            },
            {
              id: `primarySubject_${res.id}`,
              data: res.primaryRootName,
            },
            {
              id: `topic_${res.id}`,
              data: res.parentTopicName,
            },
            {
              id: `date_${res.id}`,
              data: res.responsible ? formatDate(res.responsible.lastUpdated) : "",
              width: "10%",
            },
          ])
        : [[]],
    [data, t],
  );

  const tableTitles: TitleElement<SortOptionWorkList>[] = [
    {
      title: t("welcomePage.workList.title"),
      sortableField: "title",
      width: "30%",
    },
    {
      title: t("welcomePage.workList.status"),
      sortableField: "status",
      width: "10%",
    },
    { title: t("welcomePage.workList.contentType"), sortableField: "resourceType" },
    { title: t("welcomePage.workList.primarySubject"), sortableField: "primaryRoot" },
    { title: t("welcomePage.workList.topicRelation"), sortableField: "parentTopicName" },
    {
      title: t("welcomePage.workList.date"),
      sortableField: "responsibleLastUpdated",
      width: "10%",
    },
  ];

  const subjectIds = searchQuery.data?.aggregations.flatMap((a) => a.values.map((v) => v.value));

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle title={t(headerText)} description={t(descriptionText)} Icon={CalendarLine} />
        <ControlWrapperDashboard>
          <TopRowControls>
            <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
            {!!setFilterSubject && (
              <>
                <SubjectCombobox
                  subjectIds={subjectIds ?? []}
                  filterSubject={filterSubject}
                  setFilterSubject={setFilterSubject}
                />
                <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject?.value} searchEnv="content" />
              </>
            )}
            {!!setPrioritized && (
              <SwitchRoot
                checked={prioritized}
                onCheckedChange={(details) => {
                  setPrioritized(details.checked);
                  setPage(1);
                }}
              >
                <SwitchLabel>{t("welcomePage.prioritizedLabel")}</SwitchLabel>
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchHiddenInput />
              </SwitchRoot>
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
        noResultsText={t("welcomePage.noArticles")}
        minWidth="850px"
      />
      <Pagination
        page={data?.page}
        onPageChange={(details) => setPage(details.page)}
        count={data?.totalCount ?? 0}
        pageSize={data?.pageSize}
        aria-label={t("welcomePage.pagination.workList", { resourceType: t("welcomePage.pagination.resources") })}
        buttonSize="small"
      />
    </>
  );
};

export default WorkListTabContent;
