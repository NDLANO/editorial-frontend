/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ExclamationMark } from "@ndla/icons/common";
import { Calendar } from "@ndla/icons/editor";
import { Pager } from "@ndla/pager";
import { SwitchControl, SwitchHiddenInput, SwitchThumb } from "@ndla/primitives";
import { SingleValue } from "@ndla/select";
import { IMultiSearchResult } from "@ndla/types-backend/search-api";
import CommentIndicator from "./CommentIndicator";
import PageSizeDropdown from "./PageSizeDropdown";
import StatusCell from "./StatusCell";
import SubjectDropdown from "./SubjectDropdown";
import { SortOptionWorkList } from "./WorkList";
import { useSearch } from "../../../../modules/search/searchQueries";
import formatDate from "../../../../util/formatDate";
import { toEditArticle } from "../../../../util/routeHelpers";
import {
  ControlWrapperDashboard,
  StyledLink,
  StyledSwitchLabel,
  StyledSwitchRoot,
  StyledTopRowDashboardInfo,
  TopRowControls,
} from "../../styles";
import GoToSearch from "../GoToSearch";
import TableComponent, { FieldElement, Prefix, TitleElement } from "../TableComponent";
import TableTitle from "../TableTitle";

export const CellWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
`;

const StyledExclamationMark = styled(ExclamationMark)`
  &[aria-hidden="false"] {
    visibility: hidden;
  }
`;
interface Props {
  data: IMultiSearchResult | undefined;
  isPending: boolean;
  setSortOption: (o: Prefix<"-", SortOptionWorkList>) => void;
  sortOption: string;
  error: string | undefined;
  ndlaId: string;
  setPage: (page: number) => void;
  pageSize: SingleValue;
  setPageSize: (p: SingleValue) => void;
  filterSubject?: SingleValue;
  setFilterSubject?: (fs: SingleValue) => void;
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
                  <StyledTitleWrapper>
                    <StyledExclamationMark
                      aria-hidden={!!res?.prioritized}
                      aria-label={t("editorFooter.prioritized")}
                      title={t("editorFooter.prioritized")}
                    />
                    <StyledLink to={toEditArticle(res.id, res.learningResourceType)} title={res.title?.title}>
                      {res.title?.title}
                    </StyledLink>
                  </StyledTitleWrapper>
                  {res.comments?.length ? <CommentIndicator comment={res.comments[0].content} /> : null}
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

  const lastPage = data?.totalCount ? Math.ceil(data?.totalCount / (data.pageSize ?? 1)) : 1;
  const subjectIds = searchQuery.data?.aggregations.flatMap((a) => a.values.map((v) => v.value));

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle title={t(headerText)} description={t(descriptionText)} Icon={Calendar} />
        <ControlWrapperDashboard>
          <TopRowControls>
            <PageSizeDropdown pageSize={pageSize} setPageSize={setPageSize} />
            {setFilterSubject && (
              <>
                <SubjectDropdown
                  subjectIds={subjectIds ?? []}
                  filterSubject={filterSubject}
                  setFilterSubject={setFilterSubject}
                />
                <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject?.value} searchEnv="content" />
              </>
            )}
          </TopRowControls>
          {setPrioritized && (
            <StyledSwitchRoot
              checked={prioritized}
              onCheckedChange={(details) => {
                setPrioritized(details.checked);
                setPage(1);
              }}
            >
              <StyledSwitchLabel>{t("welcomePage.prioritizedLabel")}</StyledSwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </StyledSwitchRoot>
          )}
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
      <Pager
        page={data?.page ?? 1}
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

export default WorkListTabContent;
