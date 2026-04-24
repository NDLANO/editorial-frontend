/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckLine } from "@ndla/icons";
import {
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
// import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/abstractions/Pagination";
import {
  PUBLISHED,
  STORED_SORT_OPTION_REVISION,
  STORED_FILTER_PUBLISHED,
  STORED_SHOW_REPUBLISHED,
  STORED_PAGE_SIZE_PUBLISHED_VIEW_LMA,
  STORED_PAGE_SIZE_PUBLISHED_VIEW_DA,
  STORED_PAGE_SIZE_PUBLISHED_VIEW_SA,
  STORED_PAGE_SIZE_PUBLISHED_VIEW_ALL,
  STORED_PAGE_SIZE_PUBLISHED_VIEW_FAVORITES,
} from "../../../constants";
import { SUBJECT_NODE } from "../../../modules/nodes/nodeApiTypes";
import { useSearchNodes } from "../../../modules/nodes/nodeQueries";
import { useSearch } from "../../../modules/search/searchQueries";
import formatDate from "../../../util/formatDate";
import { toEditArticle, toEditLearningpath } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import {
  useLocalStoragePageSizeState,
  useLocalStorageSortOptionState,
  useLocalStorageSubjectFilterState,
  useLocalStorageBooleanState,
} from "../hooks/storedFilterHooks";
import { ControlWrapperDashboard, StyledTopRowDashboardInfo, TopRowControls } from "../styles";
import { SelectItem } from "../types";
import { SubjectData, SubjectIdObject } from "../utils";
import TableComponent, { FieldElement, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import { WelcomePageTabsContent } from "./WelcomePageTabsContent";
import PageSizeSelect from "./worklist/PageSizeSelect";
import SubjectCombobox from "./worklist/SubjectCombobox";

const TextWrapper = styled("div", {
  base: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

const CellWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xxsmall",
  },
});

interface Props {
  userData: UserDataDTO | undefined;
  subjectIdObject: SubjectIdObject;
  isPending: boolean;
}

type SortOptionPublished = "title" | "published" | "status" | "primaryRoot";

const RecentlyPublishedView = ({ userData, isPending, subjectIdObject }: Props) => {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    if (isPending) return [];
    const tabsList = [
      {
        title: t("welcomePage.allSubjects"),
        id: "all-published-view",
        content: (
          <RevisionViewContent
            type="all"
            subjects={subjectIdObject["all"]}
            title={t("welcomePage.publishedView.all")}
            tabTitle={t("welcomePage.allSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_PUBLISHED_VIEW_ALL}
          />
        ),
      },
    ];

    if (subjectIdObject.subjectLMA.length) {
      tabsList.push({
        title: t("welcomePage.lmaSubjects"),
        id: "lma-published-view",
        content: (
          <RevisionViewContent
            type="lma"
            subjects={subjectIdObject.subjectLMA}
            title={t("welcomePage.publishedView.lma")}
            tabTitle={t("welcomePage.lmaSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_PUBLISHED_VIEW_LMA}
          />
        ),
      });
    }

    if (subjectIdObject.subjectDA.length) {
      tabsList.push({
        title: t("welcomePage.daSubjects"),
        id: "da-published-view",
        content: (
          <RevisionViewContent
            type="da"
            subjects={subjectIdObject.subjectDA}
            title={t("welcomePage.publishedView.da")}
            tabTitle={t("welcomePage.daSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_PUBLISHED_VIEW_DA}
          />
        ),
      });
    }

    if (subjectIdObject.subjectSA.length) {
      tabsList.push({
        title: t("welcomePage.saSubjects"),
        id: "sa-published-view",
        content: (
          <RevisionViewContent
            type="sa"
            subjects={subjectIdObject.subjectSA}
            title={t("welcomePage.publishedView.sa")}
            tabTitle={t("welcomePage.saSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_PUBLISHED_VIEW_SA}
          />
        ),
      });
    }

    if (userData?.favoriteSubjects?.length) {
      tabsList.push({
        title: t("welcomePage.favoriteSubjects"),
        id: "favorite-published-view",
        content: (
          <RevisionViewContent
            type="favorites"
            subjects={userData.favoriteSubjects}
            title={t("welcomePage.publishedView.favorites")}
            tabTitle={t("welcomePage.favoriteSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_PUBLISHED_VIEW_FAVORITES}
          />
        ),
      });
    }

    return tabsList;
  }, [isPending, subjectIdObject, t, userData]);

  if (!tabs?.length || isPending) return null;

  return (
    <TabsRoot
      variant="outline"
      defaultValue={tabs[0].id}
      translations={{
        listLabel: t("welcomePage.listLabels.publishedView"),
      }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
      {tabs.map((tab) => (
        <WelcomePageTabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </WelcomePageTabsContent>
      ))}
    </TabsRoot>
  );
};

interface BaseProps {
  title: string;
  tabTitle: string;
  pageSizeKey: string;
}

interface FavoriteProps extends BaseProps {
  type: "favorites";
  subjects?: string[];
}

interface SubjectProps extends BaseProps {
  type: "all" | "lma" | "da" | "sa";
  subjects: SubjectData[];
}

const RevisionViewContent = ({ title, tabTitle, type, subjects, pageSizeKey }: SubjectProps | FavoriteProps) => {
  const { t, i18n } = useTranslation();

  const [page, setPage] = useState(1);
  const [filterSubject, _setFilterSubject] = useLocalStorageSubjectFilterState(STORED_FILTER_PUBLISHED, i18n.language);
  const [pageSize, _setPageSize] = useLocalStoragePageSizeState(pageSizeKey);
  const [sortOption, setSortOption] = useLocalStorageSortOptionState<SortOptionPublished>(
    STORED_SORT_OPTION_REVISION,
    "-published",
  );
  const [alsoShowRepublished, setAlsoShowRepublished] = useLocalStorageBooleanState(STORED_SHOW_REPUBLISHED);

  const { taxonomyVersion } = useTaxonomyVersion();

  const { data: favoriteSubjects } = useSearchNodes(
    {
      ids: type === "favorites" ? subjects : [],
      taxonomyVersion,
      nodeType: [SUBJECT_NODE],
      pageSize: subjects?.length,
      language: i18n.language,
    },
    {
      enabled: type === "favorites",
    },
  );

  const subjectIds = useMemo(() => {
    if (type === "all") return undefined;
    return type === "favorites" ? (favoriteSubjects?.results.map((s) => s.id) ?? []) : subjects.map((s) => s.id);
  }, [favoriteSubjects, type, subjects]);

  const setPageSize = (item: SelectItem) => {
    _setPageSize(item);
    setPage(1);
  };

  const setFilterSubject = (subject: SelectItem | undefined) => {
    _setFilterSubject(subject);
    setPage(1);
  };

  const tableTitles: TitleElement<SortOptionPublished>[] = [
    { title: t("form.name.title"), sortableField: "title", width: "40%" },
    {
      title: t("welcomePage.workList.status"),
      sortableField: "status",
      width: "15%",
    },
    { title: t("welcomePage.workList.primarySubject"), sortableField: "primaryRoot" },
    { title: t("welcomePage.publishedView.publishedDate"), sortableField: "published" },
  ];

  const { data, isLoading, isError } = useSearch({
    subjects: filterSubject ? [filterSubject.value] : subjectIds,
    sort: sortOption,
    page: page,
    pageSize: Number(pageSize!.value),
    language: i18n.language,
    fallback: true,
    draftStatus: [PUBLISHED],
    includeOtherStatuses: true,
    isRepublished: alsoShowRepublished ? undefined : false,
    resultTypes: ["draft"],
  });

  const error = useMemo(() => {
    if (isError) {
      return t("welcomePage.errorMessage");
    }
  }, [t, isError]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      data?.results?.map((resource) => {
        return [
          {
            id: `title_${resource.id}`,
            data: (
              <CellWrapper>
                <TextWrapper>
                  <SafeLink
                    to={
                      resource.learningResourceType === "learningpath"
                        ? toEditLearningpath(resource.id, i18n.language)
                        : toEditArticle(resource.id, resource.learningResourceType)
                    }
                    title={resource.title?.title}
                  >
                    {resource.title?.title}
                  </SafeLink>
                </TextWrapper>
              </CellWrapper>
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
            id: `published_${resource.id}`,
            data: formatDate(resource.published!),
          },
        ];
      }) ?? [[]],
    [data?.results, t, i18n.language],
  );

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle title={title} description={t("welcomePage.publishedView.description")} Icon={CheckLine} />
        <ControlWrapperDashboard>
          <TopRowControls>
            <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
            {type !== "all" && (
              <SubjectCombobox
                subjectIds={subjectIds}
                filterSubject={filterSubject}
                setFilterSubject={setFilterSubject}
                placeholder={t("welcomePage.chooseSubject")}
                removeArchived
              />
            )}
            <SwitchRoot
              checked={alsoShowRepublished}
              title={t("welcomePage.publishedView.showRepublished")}
              aria-label={t("welcomePage.publishedView.showRepublished")}
              onCheckedChange={(details) => {
                setAlsoShowRepublished(details.checked);
                setPage(1);
              }}
            >
              <SwitchLabel>{t("welcomePage.publishedView.showRepublishedLabel")}</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </SwitchRoot>
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
        noResultsText={t("welcomePage.publishedView.empty")}
        minWidth="500px"
      />
      <Pagination
        page={data?.page}
        onPageChange={(details) => setPage(details.page)}
        count={data?.totalCount ?? 0}
        pageSize={data?.pageSize}
        aria-label={t("welcomePage.pagination.publishedView", { group: tabTitle.toLocaleLowerCase() })}
        buttonSize="small"
      />
    </>
  );
};

export default memo(RecentlyPublishedView);
