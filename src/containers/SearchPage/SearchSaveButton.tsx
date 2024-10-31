/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { parse, stringify } from "query-string";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { colors, fonts, spacing } from "@ndla/core";
import { IUserData } from "@ndla/types-backend/draft-api";
import { SearchParams } from "./components/form/SearchForm";
import { SearchFormSelector } from "./components/form/Selector";
import SaveButton from "../../components/SaveButton";
import { SearchType } from "../../interfaces";
import { useUpdateUserDataMutation } from "../../modules/draft/draftQueries";
import { unreachable } from "../../util/guards";

type Error = "alreadyExist" | "other" | "fetchFailed" | "";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const WarningText = styled.div`
  font-family: ${fonts.sans};
  color: ${colors.support.red};
  ${fonts.sizes(14, 1.1)};
  margin: ${spacing.xsmall} 0;
`;

const getSavedSearchRelativeUrl = (inputValue: string) => {
  const relativeUrl = inputValue.split("search")[1];
  return "/search".concat(relativeUrl);
};

type FilterValuesType = { [key in keyof SearchParams]: string };

const getDefaultFilterValues = (selectors: SearchFormSelector[], searchContentType: SearchType): FilterValuesType => {
  const result = selectors.reduce((acc, { parameterName }) => {
    acc[parameterName] = undefined;
    return acc;
  }, {} as FilterValuesType);

  switch (searchContentType) {
    case "content":
      return { ...result, query: "", "filter-inactive": "true", "exclude-revision-log": "false" };
    case "audio":
    case "image":
    case "concept":
    case "podcast-series":
      return { ...result, query: "" };
    default:
      return unreachable(searchContentType);
  }
};

const getSearchFilterPhrase = (filter: SearchFormSelector, t: TFunction): string => {
  const { parameterName } = filter;

  switch (parameterName) {
    case "responsible-ids":
      return `${t("searchForm.tagType.responsible-ids")}: ${filter.value}`;
    case "users":
      return `${t("searchForm.tagType.users")}: ${filter.value}`;
    case "filter-inactive":
      return filter.value === "false" ? `${t("searchForm.tagType.filter-inactive")}` : "";
    case "query":
    case "draft-status":
    case "status":
    case "resource-types":
    case "audio-type":
    case "language":
    case "subjects":
    case "license":
    case "concept-type":
    case "model-released":
      return filter.value ?? "";
    case "include-other-statuses":
    case "article-types":
    case "fallback":
    case "page":
    case "page-size":
    case "sort":
    case "revision-date-from":
    case "revision-date-to":
    case "exclude-revision-log":
      return "";
    default:
      return unreachable(parameterName);
  }
};

const createSearchPhrase = (selectors: SearchFormSelector[], searchContentType: SearchType, t: TFunction): string => {
  const defaultFilterValues = getDefaultFilterValues(selectors, searchContentType);
  const activeFilters = selectors.filter((selector) => selector.value !== defaultFilterValues[selector.parameterName]);

  const searchPhrase = activeFilters.reduce(
    (acc, af) => {
      const searchFilterPhrase = getSearchFilterPhrase(af, t);
      return searchFilterPhrase ? `${acc} + ${searchFilterPhrase}` : acc;
    },
    `${t(`searchTypes.${searchContentType}`)}`,
  );

  return searchPhrase.trim();
};

const createSearchString = (location: Location) => {
  const searchObject = parse(location.search);
  searchObject.page && delete searchObject.page;
  return location.pathname + "?" + stringify(searchObject);
};

interface Props {
  userData?: IUserData | undefined;
  selectors: SearchFormSelector[];
  searchContentType: SearchType;
}

const SearchSaveButton = ({ userData, selectors, searchContentType }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error>("");
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = useUpdateUserDataMutation();

  const savedSearches = userData?.savedSearches ?? [];

  useEffect(() => {
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  const handleSuccess = () => {
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleFailure = (type: Error) => {
    setLoading(false);
    setError(type);
    setSuccess(false);
  };

  const saveSearch = async () => {
    setError("");
    setLoading(true);
    const oldSearchList = savedSearches;
    if (!oldSearchList) {
      handleFailure("fetchFailed");
      return;
    }
    const newSearch = createSearchString(window.location);

    // Need to remove query if it is not in search url as it can exist in search input only
    const actualSelectors = location.search.includes("query")
      ? selectors
      : selectors.map((selector) => (selector.parameterName === "query" ? { ...selector, value: "" } : selector));
    const newSearchPhrase = createSearchPhrase(actualSelectors, searchContentType, t);

    const newSearchList = [
      { searchUrl: getSavedSearchRelativeUrl(newSearch), searchPhrase: newSearchPhrase },
      ...oldSearchList,
    ];

    if (!oldSearchList.find((s) => s.searchUrl === getSavedSearchRelativeUrl(newSearch))) {
      mutateAsync({ savedSearches: newSearchList })
        .then(() => handleSuccess())
        .catch(() => handleFailure("other"));
    } else {
      handleFailure("alreadyExist");
    }
  };

  const currentSearch = createSearchString(window.location);
  const isSaved = savedSearches.some((s) => s.searchUrl === getSavedSearchRelativeUrl(currentSearch));

  return (
    <StyledWrapper>
      <SaveButton
        isSaving={loading}
        showSaved={success}
        defaultText={isSaved ? "alreadySaved" : "saveSearch"}
        onClick={saveSearch}
        disabled={isSaved || success}
      />
      {error && (
        <WarningText>
          <span>{t("searchPage.save." + error)}</span>
        </WarningText>
      )}
    </StyledWrapper>
  );
};

export default SearchSaveButton;
