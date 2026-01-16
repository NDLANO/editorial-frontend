/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SearchParamsDTO as AudioSearchParamsDTO } from "@ndla/types-backend/audio-api";
import { DraftConceptSearchParamsDTO } from "@ndla/types-backend/concept-api";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { SearchParamsDTO as ImageSearchparamsDTO } from "@ndla/types-backend/image-api";
import { DraftSearchParamsDTO } from "@ndla/types-backend/search-api";
import SaveButton from "../../components/SaveButton";
import { CamelToKebab, SearchType } from "../../interfaces";
import { useUpdateUserDataMutation } from "../../modules/draft/draftQueries";

type Error = "alreadyExist" | "other" | "fetchFailed" | "";

type ValidSaveSearchKeys = CamelToKebab<
  | keyof DraftSearchParamsDTO
  | keyof DraftConceptSearchParamsDTO
  | keyof AudioSearchParamsDTO
  | keyof ImageSearchparamsDTO
>;

export type SearchSaveParams = { [k in ValidSaveSearchKeys]?: string | undefined | null };

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

const createSearchPhrase = (filters: SearchSaveParams, searchContentType: SearchType, t: TFunction): string => {
  const activeFilters = Object.entries(filters)
    .filter(([, value]) => !!value)
    .map(([key, value]) =>
      key === "query" ? `${t(`searchForm.tagType.${key}`)} ${value}` : t(`searchForm.tagType.${key}`, { value }),
    );
  const contentTypePhrase = t(`searchTypes.${searchContentType}`);
  if (!activeFilters.length) return contentTypePhrase;
  return `${contentTypePhrase}, ${activeFilters.join(", ")}`;
};

const createSearchString = (location: Location) => {
  const searchParams = new URLSearchParams(location.search);
  searchParams.delete("page");
  return location.pathname + "?" + searchParams.toString();
};

interface Props {
  filters: SearchSaveParams;
  searchContentType: SearchType;
  userData?: UserDataDTO | undefined;
}

const SearchSaveButton = ({ filters, searchContentType, userData }: Props) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error>("");

  const userDataMutation = useUpdateUserDataMutation();

  const savedSearches = userData?.savedSearches ?? [];

  useEffect(() => {
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const deleteSearch = (index: number) => {
    const reduced_array = userData?.savedSearches?.filter((_, idx) => idx !== index);
    userDataMutation.mutateAsync({ savedSearches: reduced_array });
  };

  const handleFailure = (type: Error) => {
    setError(type);
    setSuccess(false);
  };

  const saveSearch = async () => {
    setError("");
    const oldSearchList = savedSearches;
    if (!oldSearchList) {
      handleFailure("fetchFailed");
      return;
    }
    const newSearch = getSavedSearchRelativeUrl(createSearchString(window.location));
    const newSearchPhrase = createSearchPhrase(filters, searchContentType, t);

    const newSearchList = [{ searchUrl: newSearch, searchPhrase: newSearchPhrase }, ...oldSearchList];

    if (!oldSearchList.find((s) => s.searchUrl === newSearch)) {
      userDataMutation
        .mutateAsync({ savedSearches: newSearchList })
        .then(() => handleSuccess())
        .catch(() => handleFailure("other"));
    } else {
      handleFailure("alreadyExist");
    }
  };

  const currentSearch = getSavedSearchRelativeUrl(createSearchString(window.location));
  const savedIndex = savedSearches.findIndex((s) => s.searchUrl === currentSearch);
  const isSaved = savedIndex !== -1;

  return (
    <ButtonWrapper>
      {!!isSaved && (
        <Button size="small" variant="danger" onClick={() => deleteSearch(savedIndex)}>
          {t("welcomePage.deleteSavedSearch")}
        </Button>
      )}
      <StyledWrapper>
        <SaveButton
          loading={userDataMutation.isPending}
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
