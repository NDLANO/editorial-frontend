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
import Pager from "@ndla/pager";
import { SingleValue } from "@ndla/select";
import Tooltip from "@ndla/tooltip";
import { IMultiSearchResult } from "@ndla/types-backend/search-api";
import CommentIndicator from "./CommentIndicator";
import PageSizeDropdown from "./PageSizeDropdown";
import StatusCell from "./StatusCell";
import SubjectDropdown from "./SubjectDropdown";
import { SortOption } from "./WorkList";
import formatDate from "../../../../util/formatDate";
import { toEditArticle } from "../../../../util/routeHelpers";
import {
  ControlWrapperDashboard,
  StyledLink,
  StyledSwitch,
  StyledTopRowDashboardInfo,
  SwitchWrapper,
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
  isLoading: boolean;
  setSortOption: (o: Prefix<"-", SortOption>) => void;
  sortOption: string;
  error: string | undefined;
  ndlaId: string | undefined;
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
  isLoading,
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
  const { t } = useTranslation();

  const tableData: FieldElement[][] = useMemo(
    () =>
      data
        ? data.results.map((res) => [
            {
              id: `title_${res.id}`,
              data: (
                <CellWrapper>
                  <StyledTitleWrapper>
                    <Tooltip tooltip={t("editorFooter.prioritized")}>
                      <div>
                        <StyledExclamationMark
                          aria-hidden={!!res?.prioritized}
                          aria-label={t("editorFooter.prioritized")}
                        />
                      </div>
                    </Tooltip>
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
              data:
                res.learningResourceType !== "standard"
                  ? t(`articleType.${res.learningResourceType}`)
                  : res.contexts?.[0]?.resourceTypes?.map((context) => context.name).join(" - "),
            },
            {
              id: `primarySubject_${res.id}`,
              data: res.contexts.find((context) => context.isPrimaryConnection)?.subject ?? "",
            },
            {
              id: `topic_${res.id}`,
              data: res.contexts.length ? res.contexts[0].breadcrumbs[res.contexts[0].breadcrumbs.length - 1] : "",
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

  const tableTitles: TitleElement<SortOption>[] = [
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
    { title: t("welcomePage.workList.contentType") },
    { title: t("welcomePage.workList.primarySubject") },
    { title: t("welcomePage.workList.topicRelation") },
    {
      title: t("welcomePage.workList.date"),
      sortableField: "responsibleLastUpdated",
      width: "10%",
    },
  ];

  const lastPage = data?.totalCount ? Math.ceil(data?.totalCount / (data.pageSize ?? 1)) : 1;
  const subjectIds = data?.aggregations.flatMap((a) => a.values.map((v) => v.value));

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
                  subjectIds={subjectIds || []}
                  filterSubject={filterSubject}
                  setFilterSubject={setFilterSubject}
                />
                <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject?.value} searchEnv="content" />
              </>
            )}
          </TopRowControls>
          {setPrioritized && (
            <SwitchWrapper>
              <StyledSwitch
                checked={prioritized ?? false}
                onChange={() => {
                  setPrioritized(!prioritized);
                  setPage(1);
                }}
                label={t("welcomePage.prioritizedLabel")}
                id="filter-prioritized-switch"
              />
            </SwitchWrapper>
          )}
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
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
