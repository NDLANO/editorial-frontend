/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { createListCollection } from "@ark-ui/react";
import { SearchLine } from "@ndla/icons/common";
import {
  ComboboxControl,
  ComboboxInput,
  ComboboxLabel,
  ComboboxRoot,
  IconButton,
  Input,
  InputContainer,
} from "@ndla/primitives";
import { useComboboxTranslations } from "@ndla/ui";
import { MastheadForm } from "./MastheadForm";
import { useUserData } from "../../../modules/draft/draftQueries";
import { getAccessToken, getAccessTokenPersonal } from "../../../util/authHelpers";
import { isValid } from "../../../util/jwtHelper";
import { routes } from "../../../util/routeHelpers";
import { parseSearchParams } from "../../SearchPage/components/form/SearchForm";

const pathToTypeMapping: Record<string, string> = {
  "image-upload": "image",
  "audio-upload": "audio",
  "podcast-series": "podcast-series",
  default: "content",
};

export const MastheadSearch = () => {
  const [query, setQuery] = useState("");
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const formId = useId();
  const { t } = useTranslation();
  const comboboxTranslations = useComboboxTranslations();
  const navigate = useNavigate();
  const location = useLocation();
  const userDataQuery = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  useEffect(() => {
    setQuery("");
  }, [location.pathname]);

  const onSearchQuerySubmit = () => {
    const matched = location.pathname.split("/").find((v) => !!pathToTypeMapping[v]);
    const type = matched ? pathToTypeMapping[matched] : pathToTypeMapping.default;
    const oldParams =
      type === "content" ? parseSearchParams(location.search, false) : queryString.parse(location.search);
    const sort = type === "content" || type === "concept" ? "-lastUpdated" : "-relevance";

    const newParams = {
      ...oldParams,
      query: query || undefined,
      page: 1,
      sort,
      "page-size": 10,
    };

    navigate(routes.search(newParams, type));
  };

  const collection = useMemo(() => {
    return createListCollection({
      items: userDataQuery.data?.savedSearches ?? [],
      itemToString: (item) => item.searchPhrase,
      itemToValue: (item) => item.searchPhrase,
    });
  }, [userDataQuery.data?.savedSearches]);

  return (
    <MastheadForm id={formId} query={query} onSubmit={onSearchQuerySubmit} role="search">
      <ComboboxRoot
        collection={collection}
        inputValue={query}
        form={formId}
        highlightedValue={highlightedValue}
        onHighlightChange={(details) => setHighlightedValue(details.highlightedValue)}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        translations={comboboxTranslations}
        css={{ width: "100%" }}
        openOnClick
      >
        {/* TODO: i18n */}
        <ComboboxLabel srOnly>Search</ComboboxLabel>
        <ComboboxControl>
          <InputContainer>
            <ComboboxInput asChild>
              <Input
                placeholder={t("searchForm.placeholder")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !highlightedValue) {
                    onSearchQuerySubmit();
                  }
                }}
              />
            </ComboboxInput>
          </InputContainer>
          <IconButton
            variant="secondary"
            type="submit"
            aria-label={t("searchPage.search")}
            title={t("searchPage.search")}
          >
            <SearchLine />
          </IconButton>
        </ComboboxControl>
      </ComboboxRoot>
    </MastheadForm>
  );
};
