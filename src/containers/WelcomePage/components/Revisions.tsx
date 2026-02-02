/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLocalTimeZone, today } from "@internationalized/date";
import { NotificationLine } from "@ndla/icons";
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
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/abstractions/Pagination";
import { StatusTimeFill } from "../../../components/StatusTimeFill";
import {
  FAVOURITES_SUBJECT_ID,
  PUBLISHED,
  STORED_SORT_OPTION_REVISION,
  Revision,
  STORED_FILTER_REVISION,
  STORED_PRIMARY_CONNECTION,
  STORED_PAGE_SIZE_REVISION_VIEW_LMA,
  STORED_PAGE_SIZE_REVISION_VIEW_DA,
  STORED_PAGE_SIZE_REVISION_VIEW_SA,
  STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES,
  LMA_SUBJECT_ID,
  SA_SUBJECT_ID,
  DA_SUBJECT_ID,
} from "../../../constants";
import { SUBJECT_NODE } from "../../../modules/nodes/nodeApiTypes";
import { useSearchNodes } from "../../../modules/nodes/nodeQueries";
import { useSearch } from "../../../modules/search/searchQueries";
import formatDate, { formatDateForBackend } from "../../../util/formatDate";
import { getExpirationStatus } from "../../../util/getExpirationStatus";
import { getExpirationDate } from "../../../util/revisionHelpers";
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
import GoToSearch from "./GoToSearch";
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

const CUSTOM_SUBJECT_IDS = {
  lma: LMA_SUBJECT_ID,
  sa: SA_SUBJECT_ID,
  da: DA_SUBJECT_ID,
  favorites: FAVOURITES_SUBJECT_ID,
};

type SortOptionRevision = "title" | "revisionDate" | "status" | "primaryRoot";

const Revisions = ({ userData, isPending, subjectIdObject }: Props) => {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    if (isPending) return [];
    const tabsList = [];

    if (subjectIdObject.subjectLMA.length) {
      tabsList.push({
        title: t("welcomePage.lmaSubjects"),
        id: "lma-revision-view",
        content: (
          <RevisionViewContent
            type="lma"
            subjects={subjectIdObject.subjectLMA}
            title={t("welcomePage.revisionView.lma")}
            tabTitle={t("welcomePage.lmaSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_REVISION_VIEW_LMA}
          />
        ),
      });
    }

    if (subjectIdObject.subjectDA.length) {
      tabsList.push({
        title: t("welcomePage.daSubjects"),
        id: "da-revision-view",
        content: (
          <RevisionViewContent
            type="da"
            subjects={subjectIdObject.subjectDA}
            title={t("welcomePage.revisionView.da")}
            tabTitle={t("welcomePage.daSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_REVISION_VIEW_DA}
          />
        ),
      });
    }

    if (subjectIdObject.subjectSA.length) {
      tabsList.push({
        title: t("welcomePage.saSubjects"),
        id: "sa-revision-view",
        content: (
          <RevisionViewContent
            type="sa"
            subjects={subjectIdObject.subjectSA}
            title={t("welcomePage.revisionView.sa")}
            tabTitle={t("welcomePage.saSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_REVISION_VIEW_SA}
          />
        ),
      });
    }

    if (userData?.favoriteSubjects?.length) {
      tabsList.push({
        title: t("welcomePage.favoriteSubjects"),
        id: "favorite-revision-view",
        content: (
          <RevisionViewContent
            type="favorites"
            subjects={userData.favoriteSubjects}
            title={t("welcomePage.revisionView.favorites")}
            tabTitle={t("welcomePage.favoriteSubjects")}
            pageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES}
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
        listLabel: t("welcomePage.listLabels.subjectView"),
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
  subjects: string[];
}

interface SubjectProps extends BaseProps {
  type: "lma" | "da" | "sa";
  subjects: SubjectData[];
}

const getDataPrimaryConnectionToFavorite = (
  results: MultiSearchSummaryDTO[] | undefined,
  subjects: SubjectData[] | undefined,
) => {
  const filteredResult = results
    ?.map((r) => {
      const primarySubject = r.contexts.find((c) => c.isPrimary);
      const isFavorite = subjects?.some((s) => s.id === primarySubject?.rootId);
      return isFavorite ? r : undefined;
    })
    .filter((fd): fd is MultiSearchSummaryDTO => !!fd);

  return {
    results: filteredResult,
    totalCount: filteredResult?.length ?? 0,
    pageSize: 6,
  };
};

const currentDateAddYear = () =>
  formatDateForBackend(today(getLocalTimeZone()).add({ years: 1 }).toDate(getLocalTimeZone()));

const RevisionViewContent = ({ title, tabTitle, type, subjects, pageSizeKey }: SubjectProps | FavoriteProps) => {
  const { t, i18n } = useTranslation();

  const [page, setPage] = useState(1);
  const [filterSubject, _setFilterSubject] = useLocalStorageSubjectFilterState(STORED_FILTER_REVISION, i18n.language);
  const [pageSize, _setPageSize] = useLocalStoragePageSizeState(pageSizeKey);
  const [sortOption, setSortOption] = useLocalStorageSortOptionState<SortOptionRevision>(
    STORED_SORT_OPTION_REVISION,
    "revisionDate",
  );

  const { taxonomyVersion } = useTaxonomyVersion();

  const { data: favoriteSubjects } = useSearchNodes(
    {
      ids: type === "favorites" ? subjects : [],
      taxonomyVersion,
      nodeType: [SUBJECT_NODE],
      pageSize: subjects.length,
      language: i18n.language,
    },
    {
      enabled: type === "favorites",
    },
  );

  const subjectIds = useMemo(() => {
    return type === "favorites" ? (favoriteSubjects?.results.map((s) => s.id) ?? []) : subjects.map((s) => s.id);
  }, [favoriteSubjects, type, subjects]);

  const [onlyShowPrimaryConnection, setOnlyShowPrimaryConnection] =
    useLocalStorageBooleanState(STORED_PRIMARY_CONNECTION);

  const setPageSize = (item: SelectItem) => {
    _setPageSize(item);
    setPage(1);
  };

  const setFilterSubject = (subject: SelectItem | undefined) => {
    _setFilterSubject(subject);
    setPage(1);
  };

  const tableTitles: TitleElement<SortOptionRevision>[] = [
    { title: t("form.name.title"), sortableField: "title", width: "40%" },
    {
      title: t("welcomePage.workList.status"),
      sortableField: "status",
      width: "15%",
    },
    { title: t("welcomePage.workList.primarySubject"), sortableField: "primaryRoot" },
    { title: t("welcomePage.revisionDate"), sortableField: "revisionDate" },
  ];

  const { data, isLoading, isError } = useSearch(
    {
      subjects: filterSubject ? [filterSubject.value] : subjectIds,
      revisionDateTo: currentDateAddYear(),
      sort: sortOption,
      page: page,
      pageSize: Number(pageSize!.value),
      language: i18n.language,
      fallback: true,
      draftStatus: [PUBLISHED],
      includeOtherStatuses: true,
      resultTypes: ["draft", "concept", "learningpath"],
    },
    { enabled: !!subjectIds.length },
  );

  const error = useMemo(() => {
    if (isError) {
      return t("welcomePage.errorMessage");
    }
  }, [t, isError]);

  const filteredData = useMemo(
    () =>
      onlyShowPrimaryConnection
        ? getDataPrimaryConnectionToFavorite(data?.results, type === "favorites" ? favoriteSubjects?.results : subjects)
        : {
            results: data?.results,
            totalCount: data?.totalCount,
            pageSize: data?.pageSize ?? Number(pageSize!.value),
          },
    [onlyShowPrimaryConnection, data, type, favoriteSubjects?.results, subjects, pageSize],
  );

  const tableData: FieldElement[][] = useMemo(
    () =>
      filteredData.results?.map((resource) => {
        const expirationDate = resource.revisions.length ? getExpirationDate(resource.revisions)! : "";
        const revisions = resource.revisions
          .filter((revision) => revision.status !== Revision.revised)
          .sort((a, b) => (a.revisionDate > b.revisionDate ? 1 : -1))
          .map((revision) => `${formatDate(revision.revisionDate)}: ${revision.note}`)
          .join("\n");

        const warnStatus = getExpirationStatus(expirationDate);

        return [
          {
            id: `title_${resource.id}`,
            data: (
              <CellWrapper>
                <StatusTimeFill variant={warnStatus} size="small" title={revisions} aria-label={revisions} />
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
            id: `lastUpdated_${resource.id}`,
            data: formatDate(expirationDate!),
          },
        ];
      }) ?? [[]],
    [filteredData.results, t, i18n.language],
  );

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle title={title} description={t("welcomePage.revisionDescription")} Icon={NotificationLine} />
        <ControlWrapperDashboard>
          <TopRowControls>
            <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
            <SubjectCombobox
              subjectIds={subjectIds}
              filterSubject={filterSubject}
              setFilterSubject={setFilterSubject}
              placeholder={t("welcomePage.chooseSubject")}
              removeArchived
            />
            <GoToSearch
              filterSubject={filterSubject?.value ?? CUSTOM_SUBJECT_IDS[type]}
              searchEnv="content"
              revisionDateTo={currentDateAddYear()}
            />
            <SwitchRoot
              checked={onlyShowPrimaryConnection}
              title={t("welcomePage.primaryConnection")}
              aria-label={t("welcomePage.primaryConnection")}
              onCheckedChange={(details) => {
                setOnlyShowPrimaryConnection(details.checked);
                setPage(1);
              }}
            >
              <SwitchLabel>{t("welcomePage.primaryConnectionLabel")}</SwitchLabel>
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
        noResultsText={t("welcomePage.emptyRevision")}
        minWidth="500px"
      />
      <Pagination
        page={data?.page}
        onPageChange={(details) => setPage(details.page)}
        count={data?.totalCount ?? 0}
        pageSize={data?.pageSize}
        aria-label={t("welcomePage.pagination.revisionView", { group: tabTitle.toLocaleLowerCase() })}
        buttonSize="small"
      />
    </>
  );
};

export default memo(Revisions);
