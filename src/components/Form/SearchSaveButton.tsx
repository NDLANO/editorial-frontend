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
import { Button, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserDataDTO } from "@ndla/types-backend/draft-api";
import { Filters } from "../../components/Form/SearchTagGroup";
import SaveButton from "../../components/SaveButton";
import { SearchType } from "../../interfaces";
import { useUpdateUserDataMutation } from "../../modules/draft/draftQueries";

type Error = "alreadyExist" | "other" | "fetchFailed" | "";

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    alignItems: "flex-end",
  },
});

const getSavedSearchRelativeUrl = (inputValue: string) => {
  const relativeUrl = inputValue.split("search")[1];
  return "/search".concat(relativeUrl);
};

const createSearchPhrase = (filters: Filters, searchContentType: SearchType, t: TFunction): string => {
  const activeFilters = Object.entries(filters)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => t(`searchForm.tagType.${key}`, { value }));
  const contentTypePhrase = t(`searchTypes.${searchContentType}`);
  if (!activeFilters.length) return contentTypePhrase;
  return `${contentTypePhrase}, ${activeFilters.join(", ")}`;
};

const createSearchString = (location: Location) => {
  const searchObject = parse(location.search);
  if (searchObject.page) {
    delete searchObject.page;
  }
  return location.pathname + "?" + stringify(searchObject);
};

interface Props {
  filters: Filters;
  searchContentType: SearchType;
  userData?: IUserDataDTO | undefined;
}

const SearchSaveButton = ({ filters, searchContentType, userData }: Props) => {
  const { t } = useTranslation();
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

  const deleteSearch = (index: number) => {
    const reduced_array = userData?.savedSearches?.filter((_, idx) => idx !== index);
    mutateAsync({ savedSearches: reduced_array });
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
    const newSearch = getSavedSearchRelativeUrl(createSearchString(window.location));
    const newSearchPhrase = createSearchPhrase(filters, searchContentType, t);

    const newSearchList = [{ searchUrl: newSearch, searchPhrase: newSearchPhrase }, ...oldSearchList];

    if (!oldSearchList.find((s) => s.searchUrl === newSearch)) {
      mutateAsync({ savedSearches: newSearchList })
        .then(() => handleSuccess())
        .catch(() => handleFailure("other"));
    } else {
      handleFailure("alreadyExist");
    }
  };

  const currentSearch = getSavedSearchRelativeUrl(createSearchString(window.location));
  const isSaved = savedSearches.some((s) => s.searchUrl === getSavedSearchRelativeUrl(currentSearch));

  return (
    <ButtonWrapper>
      {!!isSaved && (
        <Button
          size="small"
          variant="danger"
          onClick={() => deleteSearch(savedSearches.findIndex((s) => s.searchUrl === currentSearch))}
        >
          {t("welcomePage.deleteSavedSearch")}
        </Button>
      )}
      <StyledWrapper>
        <SaveButton
          loading={loading}
          showSaved={success}
          defaultText={isSaved ? "alreadySaved" : "saveSearch"}
          onClick={saveSearch}
          disabled={isSaved || success}
        />
        {!!error && <Text>{t("searchPage.save." + error)}</Text>}
      </StyledWrapper>
    </ButtonWrapper>
  );
};

export default SearchSaveButton;
