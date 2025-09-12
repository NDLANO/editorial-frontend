/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpenLine, InformationLine } from "@ndla/icons";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import TableComponent, { FieldElement, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import PageSizeSelect from "./worklist/PageSizeSelect";
import Pagination from "../../../components/abstractions/Pagination";
import { SUBJECT_NODE } from "../../../modules/nodes/nodeApiTypes";
import { useSearchNodes } from "../../../modules/nodes/nodeQueries";
import { useSearchSubjectStats } from "../../../modules/search/searchQueries";
import { toSearch } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { useLocalStoragePageSizeState } from "../hooks/storedFilterHooks";
import { ControlWrapperDashboard, StyledTopRowDashboardInfo } from "../styles";
import { SubjectData } from "../utils";
import { getCurrentPageData } from "./utils";

const StyledTableHeader = styled("span", {
  base: {
    whiteSpace: "nowrap",
  },
});

interface CellHeaderProps {
  title: string;
  description: string;
}

const CellHeader = ({ title, description }: CellHeaderProps) => (
  <StyledTableHeader>
    {title} <InformationLine aria-label={description} title={description} size="small" />
  </StyledTableHeader>
);

interface BaseProps {
  title: string;
  tabTitle: string;
  description: string;
  localStoragePageSizeKey: string;
}

interface FavoriteProps extends BaseProps {
  isFavoriteTab: true;
  subjects: string[];
}
interface SubjectProps extends BaseProps {
  isFavoriteTab: false;
  subjects: SubjectData[];
}

type SortOptionSubjectView = "title" | "published" | "status" | "primaryRoot";

const SubjectViewContent = ({
  subjects,
  isFavoriteTab,
  title,
  tabTitle,
  description,
  localStoragePageSizeKey,
}: FavoriteProps | SubjectProps) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStoragePageSizeState(localStoragePageSizeKey);

  const { data: favoriteSubjects } = useSearchNodes(
    {
      ids: isFavoriteTab ? subjects : [],
      taxonomyVersion,
      nodeType: SUBJECT_NODE,
      pageSize: subjects.length,
      language: i18n.language,
    },
    {
      enabled: isFavoriteTab,
    },
  );
  const subjectIds = useMemo(() => {
    if (isFavoriteTab) {
      if (favoriteSubjects) return favoriteSubjects.results.map((s) => s.id);
      return [];
    }
    return subjects.map((s) => s.id);
  }, [favoriteSubjects, isFavoriteTab, subjects]);

  const currentPageSubjectIds = useMemo(() => {
    return getCurrentPageData(page, subjectIds, Number(pageSize!.value));
  }, [page, pageSize, subjectIds]);

  const { data, isPending, isError } = useSearchSubjectStats(
    { subjects: currentPageSubjectIds },
    { enabled: !!currentPageSubjectIds.length },
  );
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const error = useMemo(() => {
    if (isError) {
      return t("welcomePage.errorMessage");
    }
  }, [t, isError]);

  const tableTitles: TitleElement<SortOptionSubjectView>[] = [
    { title: t("form.name.title"), width: "25%" },
    {
      title: (
        <CellHeader
          title={t("welcomePage.subjectView.heart")}
          description={t("welcomePage.subjectView.heartDescription")}
        />
      ),
      width: "15%",
    },
    {
      title: (
        <CellHeader
          title={t("welcomePage.subjectView.flow")}
          description={t("welcomePage.subjectView.flowDescription")}
        />
      ),
      width: "10%",
    },
    {
      title: (
        <CellHeader
          title={t("welcomePage.subjectView.old")}
          description={t("welcomePage.subjectView.oldDescription")}
        />
      ),
    },
    {
      title: (
        <CellHeader
          title={t("welcomePage.subjectView.revision")}
          description={t("welcomePage.subjectView.revisionDescription")}
        />
      ),
    },
    {
      title: (
        <CellHeader
          title={t("welcomePage.subjectView.published")}
          description={t("welcomePage.subjectView.publishedDescription")}
        />
      ),
    },
  ];

  const tableData: FieldElement[][] = useMemo(() => {
    if (!data) return [[]];
    return data.subjects.map((stats) => {
      const subjectName = isFavoriteTab
        ? favoriteSubjects?.results.find((s) => s.id === stats.subjectId)?.name
        : subjects.find((s) => s.id === stats.subjectId)?.name;

      return [
        {
          id: `title_${stats.subjectId}`,
          data: (
            <SafeLink
              to={toSearch(
                {
                  page: "1",
                  sort: "-relevance",
                  "page-size": 10,
                  subjects: stats.subjectId,
                },
                "content",
              )}
            >
              {subjectName}
            </SafeLink>
          ),
        },
        { id: `favorites_${stats.subjectId}`, data: stats.favoritedCount },
        { id: `flow_${stats.subjectId}`, data: stats.flowCount },
        { id: `old_${stats.subjectId}`, data: stats.oldArticleCount },
        { id: `revision_${stats.subjectId}`, data: stats.revisionCount },
        { id: `publish_${stats.subjectId}`, data: stats.publishedArticleCount },
      ];
    });
  }, [data, favoriteSubjects?.results, isFavoriteTab, subjects]);

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle title={title} description={description} Icon={BookOpenLine} />
        <ControlWrapperDashboard>
          <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isPending}
        tableTitleList={tableTitles}
        tableData={tableData.filter((el) => el.length > 0)}
        error={error}
        minWidth="650px"
      />
      <Pagination
        page={page}
        onPageChange={(details) => setPage(details.page)}
        count={subjectIds.length}
        pageSize={Number(pageSize!.value)}
        aria-label={t("welcomePage.pagination.subjectView", { group: tabTitle.toLocaleLowerCase() })}
        buttonSize="small"
      />
    </>
  );
};

export default SubjectViewContent;
