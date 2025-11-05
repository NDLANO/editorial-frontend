/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BookOpenLine } from "@ndla/icons";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { MultiSearchResultDTO } from "@ndla/types-backend/search-api";
import TableComponent, { FieldElement } from "./TableComponent";
import TableTitle from "./TableTitle";
import SubjectCombobox from "./worklist/SubjectCombobox";
import { ARCHIVED, PUBLISHED, STATUS_ORDER, UNPUBLISHED } from "../../../constants";
import { useSearch } from "../../../modules/search/searchQueries";
import { toSearch } from "../../../util/routeHelpers";
import { useLocalStorageSubjectFilterState, useLocalStorageBooleanState } from "../hooks/storedFilterHooks";
import { ControlWrapperDashboard, StyledTopRowDashboardInfo, TopRowControls } from "../styles";

const EXCLUDE_STATUSES = [PUBLISHED, UNPUBLISHED, ARCHIVED];

// Function to combine results from two aggregations into one sorted result array
const getResultAggregationList = (
  searchResult: MultiSearchResultDTO | undefined,
  responibleSearchResult: MultiSearchResultDTO | undefined,
) => {
  const aggData = searchResult?.aggregations.find((a) => a.field === "draftStatus.current");
  const aggDataExcludeStatuses = aggData?.values.filter((v) => !EXCLUDE_STATUSES.includes(v.value)) ?? [];

  const responsibleAggData = responibleSearchResult?.aggregations.find((a) => a.field === "draftStatus.current");
  const responsibleAggDataExcludeStatuses =
    responsibleAggData?.values.filter((v) => !EXCLUDE_STATUSES.includes(v.value)) ?? [];

  const resultList = aggDataExcludeStatuses.map((aggData) => {
    const responsibleAgg = responsibleAggDataExcludeStatuses.find((r) => r.value === aggData.value);
    return { ...aggData, responsibleCount: responsibleAgg?.count ?? 0 };
  });
  const withMissingStatuses = STATUS_ORDER.map((s) => {
    const aggregationData = resultList.find((r) => r.value === s);
    return {
      value: s,
      count: aggregationData?.count ?? 0,
      responsibleCount: aggregationData?.responsibleCount ?? 0,
    };
  });
  const sum = withMissingStatuses.reduce(
    (acc, cur) => {
      acc.count += cur.count;
      acc.responsibleCount += cur.responsibleCount;
      return acc;
    },
    { value: "SUM", count: 0, responsibleCount: 0 },
  );
  return [...withMissingStatuses, sum];
};

interface Props {
  ndlaId: string;
  subjectIds: string[];
  title: string;
  description: string;
  searchPageSubjectFilter: string;
  localStorageKey: string;
  onHoldLocalStorageKey: string;
}

const ArticleStatusContent = ({
  ndlaId,
  subjectIds,
  title,
  description,
  searchPageSubjectFilter,
  localStorageKey,
  onHoldLocalStorageKey,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [filterSubject, setFilterSubject] = useLocalStorageSubjectFilterState(localStorageKey, i18n.language);
  const [hideOnHold, setHideOnHold] = useLocalStorageBooleanState(onHoldLocalStorageKey);

  const filteredSubjectIds: string[] = useMemo(
    () => (filterSubject ? [filterSubject.value] : subjectIds),
    [subjectIds, filterSubject],
  );
  const searchQuery = useSearch(
    {
      pageSize: 0,
      aggregatePaths: ["draftStatus.current"],
      subjects: filteredSubjectIds,
      filterInactive: true,
      resultTypes: ["draft", "concept", "learningpath"],
      ...(hideOnHold ? { priority: ["prioritized", "unspecified"] } : {}),
    },
    {
      enabled: !!subjectIds.length,
    },
  );

  const searchResponsibleQuery = useSearch(
    {
      responsibleIds: [ndlaId],
      pageSize: 0,
      aggregatePaths: ["draftStatus.current"],
      subjects: filteredSubjectIds,
      filterInactive: true,
      resultTypes: ["draft", "concept", "learningpath"],
    },
    {
      enabled: !!subjectIds.length,
    },
  );

  const error = useMemo(() => {
    if (searchQuery.isError || searchResponsibleQuery.error) {
      return t("welcomePage.errorMessage");
    }
  }, [searchQuery.isError, searchResponsibleQuery.error, t]);

  const tableTitles = [
    { title: t("welcomePage.workList.status") },
    { title: t("welcomePage.count"), width: "20%" },
    { title: t("welcomePage.countResponsible"), width: "35%" },
  ];

  const tableData: FieldElement[][] = useMemo(() => {
    const resultList = getResultAggregationList(searchQuery.data, searchResponsibleQuery.data);

    return (
      resultList.map((statusData) => {
        const statusTitle = t(`form.status.actions.${statusData.value}`);
        return statusData.value === "SUM"
          ? [
              {
                id: `status_${statusData.value}`,
                data: <Text fontWeight="bold">{t("form.status.sum")}</Text>,
              },
              {
                id: `count_${statusData.value}`,
                data: <Text fontWeight="bold">{statusData.count}</Text>,
              },
              {
                id: `responsible_${statusData.value}`,
                data: <Text fontWeight="bold">{statusData.responsibleCount}</Text>,
              },
            ]
          : [
              {
                id: `status_${statusData.value}`,
                data: (
                  <SafeLink
                    to={toSearch(
                      {
                        page: "1",
                        sort: "-relevance",
                        "page-size": 10,
                        subjects: filterSubject ? filterSubject.value : searchPageSubjectFilter,
                        "draft-status": statusData.value,
                      },
                      "content",
                    )}
                    title={statusTitle}
                  >
                    {statusTitle}
                  </SafeLink>
                ),
              },
              { id: `count_${statusData.value}`, data: statusData.count },
              {
                id: `responsible_${statusData.value}`,
                data: statusData.responsibleCount,
              },
            ];
      }) ?? [[]]
    );
  }, [filterSubject, searchPageSubjectFilter, searchQuery.data, searchResponsibleQuery.data, t]);

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle title={title} description={description} Icon={BookOpenLine} />
        <ControlWrapperDashboard>
          <TopRowControls>
            <SubjectCombobox
              subjectIds={subjectIds || []}
              filterSubject={filterSubject}
              setFilterSubject={setFilterSubject}
              removeArchived
            />
            <SwitchRoot checked={hideOnHold} onCheckedChange={(details) => setHideOnHold(details.checked)}>
              <SwitchLabel>{t("welcomePage.workList.onHoldFilter")}</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </SwitchRoot>
          </TopRowControls>
        </ControlWrapperDashboard>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={searchQuery.isLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        error={error}
        noResultsText={`${t("welcomePage.noResultsLMASubjects")}: ${EXCLUDE_STATUSES.map((status) =>
          t(`form.status.actions.${status}`),
        ).join(", ")}`}
      />
    </>
  );
};

export default ArticleStatusContent;
