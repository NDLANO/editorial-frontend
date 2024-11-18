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
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxPositioner,
  ComboboxRoot,
  IconButton,
  Input,
  InputContainer,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { useComboboxTranslations } from "@ndla/ui";
import { MastheadForm } from "./MastheadForm";
import { GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";
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
  const [value, setValue] = useState([]);
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

  const filteredSavedSearches = useMemo(() => {
    return userDataQuery.data?.savedSearches?.filter((item) => item.searchPhrase.includes(query)) ?? [];
  }, [query, userDataQuery.data?.savedSearches]);

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
      items: filteredSavedSearches,
      itemToString: (item) => item.searchPhrase,
      itemToValue: (item) => item.searchPhrase,
    });
  }, [filteredSavedSearches]);

  return (
    <MastheadForm id={formId} query={query} onSubmit={onSearchQuerySubmit} role="search">
      <ComboboxRoot
        selectionBehavior="clear"
        collection={collection}
        inputValue={query}
        form={formId}
        // We never really want to "select" anything here, I think. So we just force value to be empty
        value={value}
        onValueChange={() => setValue([])}
        highlightedValue={highlightedValue}
        onHighlightChange={(details) => setHighlightedValue(details.highlightedValue)}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        translations={comboboxTranslations}
        css={{ width: "100%" }}
        openOnClick
      >
        <ComboboxLabel srOnly>{t("searchPage.search")}</ComboboxLabel>
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
            aria-label={t("welcomePage.goToSearch")}
            title={t("welcomePage.goToSearch")}
          >
            <SearchLine />
          </IconButton>
        </ComboboxControl>
        <ComboboxPositioner>
          <ComboboxContent>
            {collection.items.length ? (
              collection.items.map((item) => (
                <ComboboxItem key={item.searchUrl} item={item} asChild>
                  <SafeLink unstyled to={item.searchUrl}>
                    <ComboboxItemText>{item.searchPhrase}</ComboboxItemText>
                    <GenericComboboxItemIndicator />
                  </SafeLink>
                </ComboboxItem>
              ))
            ) : (
              <Text>{t("welcomePage.noHitsSavedSearch")}</Text>
            )}
          </ComboboxContent>
        </ComboboxPositioner>
      </ComboboxRoot>
    </MastheadForm>
  );
};
