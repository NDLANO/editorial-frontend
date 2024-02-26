/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { subYears } from "date-fns";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { mq, breakpoints } from "@ndla/core";
import { BookOpen } from "@ndla/icons/common";
import Pager from "@ndla/pager";
import { IUserData } from "@ndla/types-backend/draft-api";
import TableComponent, { FieldElement, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import PageSizeDropdown from "./worklist/PageSizeDropdown";
import { PUBLISHED, STORED_PAGE_SIZE_SUBJECT_VIEW, STORED_SORT_OPTION_SUBJECT_VIEW } from "../../../constants";
import { useSearch } from "../../../modules/search/searchQueries";
import formatDate, { formatDateForBackend } from "../../../util/formatDate";
import { toEditArticle } from "../../../util/routeHelpers";
import { useLocalStoragePageSizeState, useLocalStorageSortOptionState } from "../hooks/storedFilterHooks";
import {
  ControlWrapperDashboard,
  StyledDashboardInfo,
  StyledLink,
  StyledTopRowDashboardInfo,
  TopRowControls,
} from "../styles";

const StyledWrapper = styled.div`
  ${mq.range({ from: breakpoints.tabletWide })} {
    margin-top: 41px;
  }
`;

interface Props {
  userData: IUserData | undefined;
}

type SortOptionSubjectView = "title" | "published" | "status" | "primaryRoot";

const SubjectView = ({ userData }: Props) => {
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useLocalStorageSortOptionState<SortOptionSubjectView>(
    STORED_SORT_OPTION_SUBJECT_VIEW,
    "published",
  );
  const [pageSize, setPageSize] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_SUBJECT_VIEW);
  const { t, i18n } = useTranslation();

  const currentDateSubtractYear = formatDateForBackend(subYears(new Date(), 5));

  const { data, isLoading, isError } = useSearch(
    {
      subjects: userData?.favoriteSubjects?.join(","),
      "published-date-to": currentDateSubtractYear,
      sort: sortOption,
      page: page,
      "page-size": Number(pageSize!.value),
      language: i18n.language,
      fallback: true,
      "filter-inactive": true,
      "draft-status": PUBLISHED,
      "include-other-statuses": true,
    },
    {
      enabled: !!userData?.favoriteSubjects?.length,
    },
  );

  const error = useMemo(() => {
    if (isError) {
      return t("welcomePage.errorMessage");
    }
  }, [t, isError]);

  const tableTitles: TitleElement<SortOptionSubjectView>[] = [
    { title: t("form.name.title"), sortableField: "title", width: "40%" },
    {
      title: t("welcomePage.workList.status"),
      sortableField: "status",
      width: "15%",
    },
    { title: t("welcomePage.workList.primarySubject"), sortableField: "primaryRoot" },
    { title: t("welcomePage.workList.lastUpdated"), sortableField: "published" },
  ];

  const tableData: FieldElement[][] = useMemo(
    () =>
      data
        ? data.results?.map((resource) => {
            return [
              {
                id: `title_${resource.id}`,
                data: (
                  <StyledLink
                    to={toEditArticle(resource.id, resource.learningResourceType)}
                    title={resource.title?.title}
                  >
                    {resource.title?.title}
                  </StyledLink>
                ),
              },
              {
                id: `status_${resource.id}`,
                data: resource.status?.current ? t(`form.status.${resource.status.current.toLowerCase()}`) : "",
              },
              {
                id: `primarySubject_${resource.id}`,
                data: resource.primaryRootName,
              },
              {
                id: `lastUpdated_${resource.id}`,
                data: formatDate(resource.published ?? ""),
              },
            ];
          })
        : [[]],
    [data, t],
  );

  const lastPage = data?.totalCount ? Math.ceil(data?.totalCount / (data.pageSize ?? 1)) : 1;

  return (
    <StyledWrapper>
      <StyledDashboardInfo>
        <StyledTopRowDashboardInfo>
          <TableTitle
            title={t("welcomePage.subjectView")}
            description={t("welcomePage.subjectViewDescription")}
            Icon={BookOpen}
          />
          <ControlWrapperDashboard>
            <TopRowControls>
              <PageSizeDropdown pageSize={pageSize} setPageSize={setPageSize} />
            </TopRowControls>
          </ControlWrapperDashboard>
        </StyledTopRowDashboardInfo>
        <TableComponent
          isLoading={isLoading}
          tableTitleList={tableTitles}
          tableData={tableData}
          setSortOption={setSortOption}
          sortOption={sortOption}
          error={error}
          noResultsText={t("welcomePage.emptySubjectView")}
          minWidth="500px"
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
      </StyledDashboardInfo>
    </StyledWrapper>
  );
};
export default SubjectView;
