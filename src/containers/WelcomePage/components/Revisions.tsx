/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import addYears from "date-fns/addYears";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alarm, Time } from "@ndla/icons/common";
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
import { IUserData } from "@ndla/types-backend/draft-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import GoToSearch from "./GoToSearch";
import TableComponent, { FieldElement, TitleElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import { WelcomePageTabsContent } from "./WelcomePageTabsContent";
import PageSizeSelect from "./worklist/PageSizeSelect";
import SubjectCombobox from "./worklist/SubjectCombobox";
import Pagination from "../../../components/abstractions/Pagination";
import { getWarnStatus } from "../../../components/HeaderWithLanguage/HeaderStatusInformation";
import {
  FAVOURITES_SUBJECT_ID,
  PUBLISHED,
  STORED_SORT_OPTION_REVISION,
  Revision,
  STORED_PAGE_SIZE_REVISION,
  STORED_FILTER_REVISION,
  STORED_PRIMARY_CONNECTION,
} from "../../../constants";
import { useSearch } from "../../../modules/search/searchQueries";
import formatDate, { formatDateForBackend } from "../../../util/formatDate";
import { toEditArticle } from "../../../util/routeHelpers";
import { getExpirationDate } from "../../ArticlePage/articleTransformers";
import {
  useLocalStoragePageSizeState,
  useLocalStorageSortOptionState,
  useLocalStorageSubjectFilterState,
  useLocalStorageBooleanState,
} from "../hooks/storedFilterHooks";
import { ControlWrapperDashboard, StyledTopRowDashboardInfo, TopRowControls } from "../styles";

const TextWrapper = styled("div", {
  base: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

const StyledTimeIcon = styled(Time, {
  base: {
    fill: "stroke.error",
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
  userData: IUserData | undefined;
}

type SortOptionRevision = "title" | "revisionDate" | "status" | "primaryRoot";

const Revisions = ({ userData }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const [filterSubject, setFilterSubject] = useLocalStorageSubjectFilterState(STORED_FILTER_REVISION, language);
  const [pageSize, setPageSize] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_REVISION);
  const [sortOption, setSortOption] = useLocalStorageSortOptionState<SortOptionRevision>(
    STORED_SORT_OPTION_REVISION,
    "revisionDate",
  );
  const [onlyShowPrimaryConnection, setOnlyShowPrimaryConnection] =
    useLocalStorageBooleanState(STORED_PRIMARY_CONNECTION);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

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

  const currentDateAddYear = formatDateForBackend(addYears(new Date(), 1));

  const { data, isPending, isError } = useSearch(
    {
      subjects: filterSubject ? [filterSubject.value] : userData?.favoriteSubjects,
      revisionDateTo: currentDateAddYear,
      sort: sortOption,
      page: page,
      pageSize: Number(pageSize!.value),
      language,
      fallback: true,
      draftStatus: [PUBLISHED],
      includeOtherStatuses: true,
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

  const getDataPrimaryConnectionToFavorite = useCallback(
    (results: IMultiSearchSummary[] | undefined) => {
      const filteredResult = results
        ?.map((r) => {
          const primarySubject = r.contexts.find((c) => c.isPrimary);
          const isFavorite = userData?.favoriteSubjects?.some((fs) => fs === primarySubject?.rootId);
          return isFavorite ? r : undefined;
        })
        .filter((fd): fd is IMultiSearchSummary => !!fd);

      return {
        results: filteredResult,
        totalCount: filteredResult?.length ?? 0,
        pageSize: 6,
      };
    },
    [userData?.favoriteSubjects],
  );

  const filteredData = useMemo(
    () =>
      onlyShowPrimaryConnection
        ? getDataPrimaryConnectionToFavorite(data?.results)
        : {
            results: data?.results,
            totalCount: data?.totalCount,
            pageSize: data?.pageSize ?? Number(pageSize!.value),
          },
    [
      onlyShowPrimaryConnection,
      data?.pageSize,
      data?.results,
      data?.totalCount,
      getDataPrimaryConnectionToFavorite,
      pageSize,
    ],
  );

  useEffect(() => {
    setPage(1);
  }, [filterSubject]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      filteredData.results?.map((resource) => {
        const expirationDate = resource.revisions.length ? getExpirationDate({ revisions: resource.revisions })! : "";
        const revisions = resource.revisions
          .filter((revision) => revision.status !== Revision.revised)
          .sort((a, b) => (a.revisionDate > b.revisionDate ? 1 : -1))
          .map((revision) => `${formatDate(revision.revisionDate)}: ${revision.note}`)
          .join("\n");

        const warnStatus = getWarnStatus(expirationDate);

        return [
          {
            id: `title_${resource.id}`,
            data: (
              <CellWrapper>
                <StyledTimeIcon
                  size="small"
                  data-status={warnStatus}
                  title={revisions}
                  aria-label={revisions}
                  aria-hidden={warnStatus === "warn"}
                  visibility={warnStatus === "warn" ? "hidden" : "visible"}
                />
                <TextWrapper>
                  <SafeLink
                    to={toEditArticle(resource.id, resource.learningResourceType)}
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
    [filteredData, t],
  );

  return (
    <TabsRoot variant="outline" defaultValue="revision" translations={{}}>
      <TabsList>
        <TabsTrigger value="revision">{t("welcomePage.revision")}</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <WelcomePageTabsContent value="revision">
        <StyledTopRowDashboardInfo>
          <TableTitle
            title={t("welcomePage.revision")}
            description={t("welcomePage.revisionDescription")}
            Icon={Alarm}
            infoText={t("welcomePage.revisionInfo")}
          />
          <ControlWrapperDashboard>
            <TopRowControls>
              <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
              <SubjectCombobox
                subjectIds={userData?.favoriteSubjects ?? []}
                filterSubject={filterSubject}
                setFilterSubject={setFilterSubject}
                placeholder={t("welcomePage.chooseFavoriteSubject")}
                removeArchived
              />
              <GoToSearch
                filterSubject={filterSubject?.value ?? FAVOURITES_SUBJECT_ID}
                searchEnv="content"
                revisionDateTo={currentDateAddYear}
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
          isPending={isPending}
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
          aria-label={t("welcomePage.pagination.revision")}
          buttonSize="small"
        />
      </WelcomePageTabsContent>
    </TabsRoot>
  );
};

export default memo(Revisions);
