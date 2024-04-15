/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { BookOpen, InformationOutline } from "@ndla/icons/common";
import { Pager } from "@ndla/pager";
import { getCurrentPageData } from "./LastUsedItems";
import TableComponent, { FieldElement, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import PageSizeDropdown from "./worklist/PageSizeDropdown";
import { SUBJECT_NODE } from "../../../modules/nodes/nodeApiTypes";
import { useSearchNodes } from "../../../modules/nodes/nodeQueries";
import { useSearchSubjectStats } from "../../../modules/search/searchQueries";
import { toSearch } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { useLocalStoragePageSizeState } from "../hooks/storedFilterHooks";
import { ControlWrapperDashboard, StyledLink, StyledTopRowDashboardInfo, TopRowControls } from "../styles";
import { SubjectData } from "../utils";

const StyledTableHeader = styled.span`
  white-space: nowrap;
`;

interface CellHeaderProps {
  title: string;
  description: string;
}

const CellHeader = ({ title, description }: CellHeaderProps) => (
  <StyledTableHeader>
    {title} <InformationOutline aria-label={description} title={description} />
  </StyledTableHeader>
);

interface BaseProps {
  title: string;
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

  const subjectIds = isFavoriteTab ? subjects : subjects.map((s) => s.id);

  const currentPageSubjectIds = useMemo(() => {
    return getCurrentPageData(page, subjectIds, Number(pageSize!.value));
  }, [page, pageSize, subjectIds]);

  const { data, isLoading, isError } = useSearchSubjectStats(
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
      if (!subjectName) return [];
      return [
        {
          id: `title_${stats.subjectId}`,
          data: (
            <StyledLink
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
            </StyledLink>
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

  const lastPage = subjectIds.length ? Math.ceil(subjectIds.length / Number(pageSize!.value)) : 1;

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle title={title} description={description} Icon={BookOpen} />
        <ControlWrapperDashboard>
          <TopRowControls>
            <PageSizeDropdown pageSize={pageSize} setPageSize={setPageSize} />
          </TopRowControls>
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={tableTitles}
        tableData={tableData.filter((el) => el.length > 0)}
        error={error}
        minWidth="650px"
      />
      <Pager
        page={page ?? 1}
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

export default SubjectViewContent;
