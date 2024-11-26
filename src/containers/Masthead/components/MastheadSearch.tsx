/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useEffect, useId, useMemo, useState, FormEvent } from "react";
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
  ComboboxRoot,
  IconButton,
  Input,
  InputContainer,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useComboboxTranslations } from "@ndla/ui";
import { GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";
import { isValidLocale } from "../../../i18n";
import { fetchNewArticleId } from "../../../modules/draft/draftApi";
import { useUserData } from "../../../modules/draft/draftQueries";
import { fetchNode, fetchNodes } from "../../../modules/nodes/nodeApi";
import { resolveUrls } from "../../../modules/taxonomy/taxonomyApi";
import { getAccessToken, getAccessTokenPersonal } from "../../../util/authHelpers";
import { isNDLAFrontendUrl } from "../../../util/htmlHelpers";
import { isValid } from "../../../util/jwtHelper";
import { routes } from "../../../util/routeHelpers";
import { parseSearchParams } from "../../SearchPage/components/form/SearchForm";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const pathToTypeMapping: Record<string, string> = {
  "image-upload": "image",
  "audio-upload": "audio",
  "podcast-series": "podcast-series",
  default: "content",
};

const MastheadForm = styled("form", {
  base: {
    width: "100%",
  },
});

export const MastheadSearch = () => {
  const [value, setValue] = useState([]);
  const [query, setQuery] = useState("");
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const formId = useId();
  const { t, i18n } = useTranslation();
  const comboboxTranslations = useComboboxTranslations();
  const { taxonomyVersion } = useTaxonomyVersion();
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

  const handleNodeId = async (nodeId: number) => {
    try {
      const newArticle = await fetchNewArticleId(nodeId);
      navigate(routes.editArticle(newArticle.id, "standard"));
    } catch (error) {
      navigate(routes.notFound);
    }
  };

  const handleTaxonomyId = async (taxId: string) => {
    try {
      const taxElement = await fetchNode({ id: taxId, taxonomyVersion });
      const arr = taxElement.contentUri?.split(":");
      if (arr) {
        const id = arr[arr.length - 1];
        navigate(routes.editArticle(parseInt(id), "standard"));
      }
    } catch (error) {
      navigate(routes.notFound);
    }
  };

  const handleUrlPaste = (frontendUrl: string) => {
    // Removes search queries before split
    const ndlaUrl = frontendUrl.split(/\?/)[0];
    // Strip / from end if topic
    const cleanUrl = ndlaUrl.endsWith("/")
      ? ndlaUrl.replace("/subjects", "").slice(0, -1)
      : ndlaUrl.replace("/subjects", "");
    const splittedNdlaUrl = cleanUrl.split("/");

    const urlId = splittedNdlaUrl[splittedNdlaUrl.length - 1];

    if (
      !urlId.includes("urn:topic") &&
      Number.isNaN(parseFloat(urlId)) &&
      !splittedNdlaUrl.find((e) => e.match(/subject:*/)) === undefined &&
      !/[a-f1-9]{10}/g.test(urlId)
    ) {
      return;
    }
    if (urlId.includes("urn:topic")) {
      handleTopicUrl(urlId);
    } else if (splittedNdlaUrl.includes("node")) {
      handleNodeId(parseInt(urlId));
    } else if (splittedNdlaUrl.find((e) => e.match(/subject:*/))) {
      handleFrontendUrl(cleanUrl);
    } else if (/[a-f1-9]{10}/g.test(urlId)) {
      handleContextId(urlId);
    } else {
      navigate(routes.editArticle(parseInt(urlId), "standard"));
    }
  };

  const handleTopicUrl = async (urlId: string) => {
    try {
      const topicArticle = await fetchNode({
        id: urlId,
        language: i18n.language,
        taxonomyVersion,
      });
      const arr = topicArticle.contentUri?.split(":") ?? [];
      const id = arr[arr.length - 1];
      navigate(routes.editArticle(parseInt(id), "topic-article"));
    } catch {
      navigate(routes.notFound);
    }
  };

  const handleContextId = async (urlId: string) => {
    try {
      const nodes = await fetchNodes({
        contextId: urlId,
        language: i18n.language,
        taxonomyVersion,
      });
      const arr = nodes[0]?.contentUri?.split(":") ?? [];
      const id = arr[arr.length - 1];
      navigate(routes.editArticle(parseInt(id), "topic-article"));
    } catch {
      navigate(routes.notFound);
    }
  };

  const handleFrontendUrl = async (url: string) => {
    const { pathname } = new URL(url);
    const paths = pathname.split("/");
    const path = isValidLocale(paths[1]) ? paths.slice(2).join("/") : pathname;

    try {
      const newArticle = await resolveUrls({
        path,
        taxonomyVersion: "default",
      });
      const splittedUri = newArticle.contentUri.split(":");
      const articleId = splittedUri[splittedUri.length - 1];
      navigate(routes.editArticle(parseInt(articleId), "standard"));
    } catch {
      navigate(routes.notFound);
    }
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const isNDLAUrl = isNDLAFrontendUrl(query);
    const isNodeId = query.length > 2 && /#\d+/g.test(query) && !Number.isNaN(parseFloat(query.substring(1)));

    const isTaxonomyId = query.length > 2 && /#urn:(resource|topic)[:\da-fA-F-]+/g.test(query);

    if (isNDLAUrl) {
      handleUrlPaste(query);
    } else if (isNodeId) {
      handleNodeId(parseInt(query.substring(1)));
    } else if (isTaxonomyId) {
      handleTaxonomyId(query.substring(1));
    } else {
      handleQuerySubmit();
    }
  };

  const handleQuerySubmit = () => {
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
    <MastheadForm id={formId} onSubmit={handleSubmit} role="search">
      <ComboboxRoot
        selectionBehavior="preserve"
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
                    handleSubmit(e);
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
      </ComboboxRoot>
    </MastheadForm>
  );
};
